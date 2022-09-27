// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./DSGDToken.sol";
import "hardhat/console.sol";

/// @title PBM Contract for Campaign Organisers
/// @notice Contract to govern PBM related operations for a campaign organiser
/// @dev Most functions utilises OpenZepellin, with constrained modifiers in place to tighten up access control

contract PBMToken is ERC20Pausable, AccessControlEnumerable {
    using SafeERC20 for DSGDToken;

    DSGDToken private underlyingToken;
    address public immutable owner;
    uint8 private constant DECIMALS = 18;

    /// @notice Returns the static pegging of PBM token to underlying token, with decimal difference accounted for
    /// @dev  Calculated pegged ratio as underlying.decimals() / pbm * pbm.decimals() to signifiy 1-1 pegging
    /// @return static pegging with decimal difference accounted for
    uint8 public immutable peggedRatio;

    uint256 public contractExpiry;

    // RBAC related constants
    bytes32 public constant DISSOLVER_ROLE = keccak256("DISSOLVER_ROLE");
    bytes32 public constant DISSOLVER_ADMIN_ROLE =
        keccak256("DISSOLVER_ADMIN_ROLE");

    modifier onlyOwner() {
        require(_msgSender() == owner, "Not owner");
        _;
    }

    modifier onlyDissovlerRecipients(address recipient) {
        require(hasRole(DISSOLVER_ROLE, recipient), "not a dissolver");
        _;
    }

    modifier whenNotExpired() {
        require(block.timestamp < contractExpiry, "contract expired");
        _;
    }

    constructor(
        address baseDsgdAddress,
        string memory _name,
        string memory _symbol,
        uint256 _contractExpiry
    ) ERC20(_name, _symbol) {
        owner = _msgSender();
        // Initialises the base DSGD token
        underlyingToken = DSGDToken(baseDsgdAddress);
        peggedRatio = underlyingToken.decimals() / DECIMALS;

        // Sets up required roles
        _grantRole(DISSOLVER_ADMIN_ROLE, owner);
        _setRoleAdmin(DISSOLVER_ROLE, DISSOLVER_ADMIN_ROLE);

        // Set the contract expiry
        contractExpiry = _contractExpiry;
    }

    /// @notice Similar to a deposit function of a wrapped token. Caller has to approve contract's address on underlying token. Limited to owner
    /// @dev Current logic for decimal conversion is not finalised
    /// @param recipient address of recipient to mint to
    /// @param amount pbm tokens to be minted, expressed in this contracts decimal
    /// @return returns success state of mint
    function addSupply(address recipient, uint256 amount)
        external
        onlyOwner
        whenNotExpired
        returns (bool)
    {
        underlyingToken.safeTransferFrom(
            _msgSender(),
            address(this),
            amount * peggedRatio
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
        whenNotExpired
        onlyDissovlerRecipients(recipient)
    {
        underlyingToken.safeTransfer(recipient, amount * peggedRatio);
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

    function revokeDissolverRole(address account) external onlyOwner {
        _revokeRole(DISSOLVER_ROLE, account);
    }

    function grantDissolverRole(address account) external onlyOwner {
        _grantRole(DISSOLVER_ROLE, account);
    }

    function extendExpiry(uint256 expiryDate)
        external
        onlyOwner
        whenNotExpired
    {
        require(expiryDate > contractExpiry, "cannot shorten expiry date");
        contractExpiry = expiryDate;
    }

    /// @inheritdoc	ERC20
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC20Pausable) {
        require(block.timestamp < contractExpiry, "contract expired");
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
