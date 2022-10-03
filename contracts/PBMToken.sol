// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IPBM.sol";

import "hardhat/console.sol";

/// @title PBM Contract for Campaign Organisers
/// @notice Contract to govern PBM related operations for a campaign organiser
/// @dev Most functions utilises OpenZepellin, with constrained modifiers in place to tighten up access control

contract PBMToken is ERC20Pausable, AccessControlEnumerable, IPBM {
    using SafeERC20 for IERC20Metadata;

    IERC20Metadata public immutable underlyingToken;
    address public immutable owner;
    uint8 public constant peggedRatio = 1;

    uint256 public contractExpiry;

    // RBAC related constants
    bytes32 public constant MERCHANT_ROLE = keccak256("MERCHANT_ROLE");
    bytes32 public constant MERCHANT_ADMIN_ROLE = keccak256("MERCHANT_ADMIN_ROLE");

    modifier onlyOwner() {
        require(_msgSender() == owner, "not owner");
        _;
    }

    modifier onlyDissovlerRecipients(address recipient) {
        require(hasRole(MERCHANT_ROLE, recipient), "recipient not an approved merchant");
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
        underlyingToken = IERC20Metadata(baseDsgdAddress);
        assert(decimals() != 0);

        // Sets up required roles for merchant management
        _grantRole(MERCHANT_ADMIN_ROLE, owner);
        _setRoleAdmin(MERCHANT_ROLE, MERCHANT_ADMIN_ROLE);

        // Sets the contract expiry
        contractExpiry = _contractExpiry;
    }

    function wrapMint(address toUser, uint256 amount) external onlyOwner whenNotExpired {
        underlyingToken.safeTransferFrom(_msgSender(), address(this), amount);
        _mint(toUser, amount);
    }

    function redeem(address toUser, uint256 amount) external whenNotExpired onlyDissovlerRecipients(toUser) {
        underlyingToken.safeTransfer(toUser, amount * peggedRatio);
        _burn(_msgSender(), amount);
    }

    function withdraw() external onlyOwner returns (bool) {
        require(block.timestamp > contractExpiry, "contract expiry not reached");
        uint256 underlyingBalance = underlyingToken.balanceOf(address(this));
        underlyingToken.safeTransfer(owner, underlyingBalance);
        return true;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function revokeMerchantRole(address account) external {
        revokeRole(MERCHANT_ROLE, account);
    }

    function grantMerchantRole(address account) external {
        grantRole(MERCHANT_ROLE, account);
    }

    function extendExpiry(uint256 expiryDate) external onlyOwner whenNotExpired {
        require(expiryDate > contractExpiry, "cannot shorten expiry date");
        contractExpiry = expiryDate;
    }

    function recover(address account) external onlyOwner returns (uint256) {
        uint256 overBalance = underlyingToken.balanceOf(address(this)) - totalSupply();

        _mint(account, overBalance);
        return overBalance;
    }

    function decimals() public view override returns (uint8) {
        try underlyingToken.decimals() returns (uint8 value) {
            return value;
        } catch {
            return 0;
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC20Pausable) whenNotExpired {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
