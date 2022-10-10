// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

pragma solidity ^0.8.8;

/// @title Upgradeable PBM Token (via ERC20Upgradeable standard)
/// @notice Interface of the Purpose Bound Money (PBM) token for RedeemX

interface IPBMUpgradeable is IERC20Upgradeable {
    /// @dev Emitted after a PBM redemption takes place
    /// @param fromUser The address of the recipient (person redeeming)
    /// @param toUser The address of the merchant (person)
    /// @param amount The amount being redeemed for
    event Redemption(address indexed fromUser, address indexed toUser, uint256 amount);

    /// @dev Emitted when a PBM Owner successfully withdraws underlying tokens
    /// @param account The account (PBM Owner) that made a withdrawal
    /// @param amount The amount of underlying tokens withdrawn from contract
    event OwnerWithdrawal(address account, uint256 amount);

    /// @dev Emitted when an authorised admin adds a merchant
    /// @param account The merchant account that was added
    /// @param admin The admin associated with the adding of merchant
    event MerchantAdded(address account, address admin);

    /// @dev Emitted when an authorised admin revokes a merchant
    /// @param account The merchant account that was revoked
    /// @param admin The admin associated with the removal/revoke of a merchant
    event MerchantRevoked(address account, address admin);

    /// @dev Emitted when an expiry has been extended
    /// @param admin The admin account associtated that triggered the extension
    event CampaignExtended(address admin);

    /// @notice Mints PBM token, and consumes underlying token
    /// @dev This function should be used to handle wrapping and minting logic of PBM against an underlying token
    /// @param toUser The address of the recipient receiving the PBM token
    /// @param amount The amount, in PBM tokens, to mint. Same equivalence of underlying token will be wrapped
    function wrapMint(address toUser, uint256 amount) external;

    /// @notice Unwraps the PBM token and transfers to merchant. Function is called by the recipient of PBM tokens.
    /// @dev This function should specify and enforce the requirements for PBM -> underlying token to take place.
    /// For recipient related enforcement, it is recommended to have a modifier in place
    /// Underlying token transfer, and proper burning of PBM token supply should also be done here.
    /// Emits a { Redemption } on success
    /// @param toUser The address of a merchant to receive the unwrapped PBM
    /// @param amount The amount, in PBM tokens, to be redeemed
    function redeem(address toUser, uint256 amount) external;

    /// @notice Allows for unused DSGD to be returned back to original owner
    /// @dev This function should only suceed when the contract's expiry date has been reached
    /// Function should revert, instead of returning `false` on failure
    /// Emits a { OwnerWithdrawal } on success
    function withdraw() external returns (bool);

    /// @notice Allows for extension of a PBM campaign
    /// @dev IMPORTANT: Proper checks (eg; extending an already expired contract) and access control should be in place for this function for PBM campaigns that rely on expiry date as a governing logic for redemption
    /// Function should revert, instead of returning `false` on failure

    /// @param expiryDate The new expiry date (in UNIX epoch time format)
    /// @dev Emits a { CampaignExtended } on success
    function extendExpiry(uint256 expiryDate) external;

    /// @notice Allows for the granting of merchant roles into an approved merchant list
    /// @dev Implementation is flexible to different concerns (eg; having the ability to enumerate merchant roles)
    /// This should correspond to the restrictions place in the `redeem` function.
    /// Emits a { MerchantAdded } on success
    /// @param account The address of a merchant to be added into the approved merchant list
    function grantMerchantRole(address account) external;

    /// @notice Allows for the revoking of already exisiting accounts in the merchant list
    /// @dev Should revert on failure
    /// Emits a { MerchantRevoked } on success
    /// @param account The address of a merchant to be revoked from the approved merchant list
    function revokeMerchantRole(address account) external;
}
