# PBMToken

*Open Government Products*

> PBM contract

Implementation of the IPBM interface



## Methods

### DEFAULT_ADMIN_ROLE

```solidity
function DEFAULT_ADMIN_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### MERCHANT_ADMIN_ROLE

```solidity
function MERCHANT_ADMIN_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### MERCHANT_ROLE

```solidity
function MERCHANT_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```



*See {IERC20-allowance}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| owner | address | undefined |
| spender | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### approve

```solidity
function approve(address spender, uint256 amount) external nonpayable returns (bool)
```



*See {IERC20-approve}. NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on `transferFrom`. This is semantically equivalent to an infinite approval. Requirements: - `spender` cannot be the zero address.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| spender | address | undefined |
| amount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```



*See {IERC20-balanceOf}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### contractExpiry

```solidity
function contractExpiry() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### decimals

```solidity
function decimals() external view returns (uint8)
```



*Returns the number of decimals used to get its user representation. For example, if `decimals` equals `2`, a balance of `505` tokens should be displayed to a user as `5.05` (`505 / 10 ** 2`). Tokens usually opt for a value of 18, imitating the relationship between Ether and Wei. This is the value {ERC20} uses, unless this function is overridden; NOTE: This information is only used for _display_ purposes: it in no way affects any of the arithmetic of the contract, including {IERC20-balanceOf} and {IERC20-transfer}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined |

### decreaseAllowance

```solidity
function decreaseAllowance(address spender, uint256 subtractedValue) external nonpayable returns (bool)
```



*Atomically decreases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| spender | address | undefined |
| subtractedValue | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### extendExpiry

```solidity
function extendExpiry(uint256 expiryDate) external nonpayable
```



*Emits a { CampaignExtended } on success*

#### Parameters

| Name | Type | Description |
|---|---|---|
| expiryDate | uint256 | The new expiry date (in UNIX epoch time format) |

### getRoleAdmin

```solidity
function getRoleAdmin(bytes32 role) external view returns (bytes32)
```



*Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role&#39;s admin, use {_setRoleAdmin}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### grantMerchantRole

```solidity
function grantMerchantRole(address account) external nonpayable
```

Allows for the granting of merchant roles into an approved merchant list

*Implemented as a wrapper of {AccessControl}*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | The address of a merchant to be added into the approved merchant list |

### grantRole

```solidity
function grantRole(bytes32 role, address account) external nonpayable
```



*Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``&#39;s admin role. May emit a {RoleGranted} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### hasRole

```solidity
function hasRole(bytes32 role, address account) external view returns (bool)
```



*Returns `true` if `account` has been granted `role`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### increaseAllowance

```solidity
function increaseAllowance(address spender, uint256 addedValue) external nonpayable returns (bool)
```



*Atomically increases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| spender | address | undefined |
| addedValue | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### name

```solidity
function name() external view returns (string)
```



*Returns the name of the token.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### owner

```solidity
function owner() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### pause

```solidity
function pause() external nonpayable
```



*Allows for pausing of contract activities Caller has to be owner*


### paused

```solidity
function paused() external view returns (bool)
```



*Returns true if the contract is paused, and false otherwise.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### recover

```solidity
function recover(address account) external nonpayable returns (uint256)
```



*Additional control measure to maintain total supply parity should underlying tokens be credited to contract*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### redeem

```solidity
function redeem(address toUser, uint256 amount) external nonpayable
```



*Allows PBM recipients to unwrap and credit underlying token to a merchant Requirements: - the caller must have already owned PBM tokens - the contract is not paused - the contract is not expired Emits a { Redemption } on success*

#### Parameters

| Name | Type | Description |
|---|---|---|
| toUser | address | undefined |
| amount | uint256 | undefined |

### renounceRole

```solidity
function renounceRole(bytes32 _role, address _account) external nonpayable
```



*Overriden functionality to prevent self-renouncing of roles from {AccessControl} This is a temporary measure for the context of this trial.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _role | bytes32 | undefined |
| _account | address | undefined |

### revokeMerchantRole

```solidity
function revokeMerchantRole(address account) external nonpayable
```

Allows for the revoking of already exisiting accounts in the merchant list

*Implemented as a wrapper of {AccessControl}*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | The address of a merchant to be revoked from the approved merchant list |

### revokeRole

```solidity
function revokeRole(bytes32 role, address account) external nonpayable
```



*Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``&#39;s admin role. May emit a {RoleRevoked} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```



*See {IERC165-supportsInterface}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interfaceId | bytes4 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### symbol

```solidity
function symbol() external view returns (string)
```



*Returns the symbol of the token, usually a shorter version of the name.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```



*See {IERC20-totalSupply}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transfer

```solidity
function transfer(address to, uint256 amount) external nonpayable returns (bool)
```



*See {IERC20-transfer}. Requirements: - `to` cannot be the zero address. - the caller must have a balance of at least `amount`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | undefined |
| amount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) external nonpayable returns (bool)
```



*See {IERC20-transferFrom}. Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20}. NOTE: Does not update the allowance if the current allowance is the maximum `uint256`. Requirements: - `from` and `to` cannot be the zero address. - `from` must have a balance of at least `amount`. - the caller must have allowance for ``from``&#39;s tokens of at least `amount`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| amount | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### underlyingToken

```solidity
function underlyingToken() external view returns (contract IERC20Metadata)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20Metadata | undefined |

### unpause

```solidity
function unpause() external nonpayable
```



*Allows for resumption of an already paused contract of contract by owner Caller has to be owner*


### withdraw

```solidity
function withdraw() external nonpayable returns (bool)
```



*Allows PBM owner to withdraw a campaign once the stipulated conditions are met For this implementation, an owner should be allowed to withdraw all unused DSGD after a pre-determined expiry has been met Requirements: - the contract is already expired - the caller is owner*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### wrapMint

```solidity
function wrapMint(address toUser, uint256 amount) external nonpayable
```



*Allows owner/minter to mint tokens from underlying tokens PREREQUISITE: Owners/Minters should have already approved this contract address to spend the underlying tokens on behalf of the owner/minter. Requirements: - the caller must be `owner`. - the contract is not paused - the contract is not expired - there has to be sufficient underlying token held by the owners that have been approved for  Emits a { Transfer } on success, inherited from {ERC20}*

#### Parameters

| Name | Type | Description |
|---|---|---|
| toUser | address | undefined |
| amount | uint256 | undefined |



## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 value)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| spender `indexed` | address | undefined |
| value  | uint256 | undefined |

### CampaignExtended

```solidity
event CampaignExtended(address admin)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| admin  | address | undefined |

### MerchantAdded

```solidity
event MerchantAdded(address account, address admin)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |
| admin  | address | undefined |

### MerchantRevoked

```solidity
event MerchantRevoked(address account, address admin)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |
| admin  | address | undefined |

### OwnerWithdrawal

```solidity
event OwnerWithdrawal(address account, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |
| amount  | uint256 | undefined |

### Paused

```solidity
event Paused(address account)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |

### Redemption

```solidity
event Redemption(address indexed fromUser, address indexed toUser, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| fromUser `indexed` | address | undefined |
| toUser `indexed` | address | undefined |
| amount  | uint256 | undefined |

### RoleAdminChanged

```solidity
event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| previousAdminRole `indexed` | bytes32 | undefined |
| newAdminRole `indexed` | bytes32 | undefined |

### RoleGranted

```solidity
event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| account `indexed` | address | undefined |
| sender `indexed` | address | undefined |

### RoleRevoked

```solidity
event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| account `indexed` | address | undefined |
| sender `indexed` | address | undefined |

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 value)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| value  | uint256 | undefined |

### Unpaused

```solidity
event Unpaused(address account)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | undefined |



