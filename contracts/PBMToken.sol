// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "./DSGDToken.sol";

/// @title PBM Contract for Campaign Organisers
/// @notice Contract to govern PBM related operations for a campaign organiser
/// @dev Most functions utilises OpenZepellin, with constrained modifiers in place to tighten up access control

contract PBMToken is ERC20Pausable, AccessControl {
    DSGDToken private underlyingToken;
    address public immutable owner;
    uint8 private constant DECIMALS = 18;

    // Defines the 1-1 pegging between PBM and DSGD, accounting for decimal
    uint8 private constant PEGGING_TO_BASE_TOKEN = 1;

    /// @notice Returns the static pegging of PBM token to underlying token, with decimal difference accounted for
    /// @dev  Calculated as ratio underlying * underlying.decimals() / pbm * pbm.decimals()
    /// @return static pegging with decimal difference accounted for
    uint8 public immutable ratio;

    // RBAC related constants
    bytes32 public constant DISSOLVER_ROLE = keccak256("DISSOLVER_ROLE");
    bytes32 public constant DISSOLVER_ADMIN_ROLE =
        keccak256("DISSOLVER_ADMIN_ROLE");

    modifier onlyOwner() {
        require(_msgSender() == owner, "Not owner");
        _;
    }

    modifier onlyDissovlerRecipients(address recipient) {
        require(hasRole(DISSOLVER_ROLE, recipient) == true, "not a dissolver");
        _;
    }

    constructor(
        address baseDsgdAddress,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        owner = _msgSender();
        // Initialises the base DSGD token
        underlyingToken = DSGDToken(baseDsgdAddress);
        ratio = PEGGING_TO_BASE_TOKEN * (underlyingToken.decimals() / DECIMALS);

        // Sets up required roles
        _grantRole(DISSOLVER_ADMIN_ROLE, owner);
        _setRoleAdmin(DISSOLVER_ROLE, DISSOLVER_ADMIN_ROLE);
    }

    /// @notice Similar to a deposit function of a wrapped token. Caller has to approve contract's address on underlying token. Limited to owner
    /// @dev Current logic for decimal conversion is not finalised
    /// @param recipient address of recipient to mint to
    /// @param amount pbm token s to be minted, expressed in this contracts decimal
    /// @return returns success state of mint
    function addSupply(address recipient, uint256 amount)
        external
        onlyOwner
        returns (bool)
    {
        underlyingToken.transferFrom(
            _msgSender(),
            address(this),
            amount * ratio
        );
        _mint(recipient, amount);
        return true;
    }

    /// @notice Dissolves PBM tokens into actual underlying token. Used for resident -> merchant transactions
    /// @dev Utilises contract call to underlying token for transfer, proceeds to then burn PBM tokens dissolved (with accordance to ratio).
    /// @param recipient address of the recipient to transfer to. In this context, refers to merchant.
    /// @param amount amount, in PBM decimals, to be transferred
    function dissolveIntoDsgd(address recipient, uint256 amount)
        external
        onlyDissovlerRecipients(recipient)
    {
        underlyingToken.transfer(recipient, amount * ratio);
        _burn(_msgSender(), amount);
    }

    /// @notice Pauses all transfer activity (specified in ERC20Pausable). Limited to owner
    /// @dev extension overrides _beforeTokenTransfer's implementation.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Pauses all transfer activity (specified in ERC20Pausable). Limited to owner
    /// @dev extension overrides _beforeTokenTransfer's implementation.
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @inheritdoc	ERC20
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
}
