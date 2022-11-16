# IPBM



> PBM Token (via ERC20 standard)

Interface of the Purpose Bound Money (PBM) token for RedeemX



## Methods

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```



*Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through {transferFrom}. This is zero by default. This value changes when {approve} or {transferFrom} are called.*

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



*Sets `amount` as the allowance of `spender` over the caller&#39;s tokens. Returns a boolean value indicating whether the operation succeeded. IMPORTANT: Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender&#39;s allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729 Emits an {Approval} event.*

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



*Returns the amount of tokens owned by `account`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### extendExpiry

```solidity
function extendExpiry(uint256 expiryDate) external nonpayable
```



*Emits a { CampaignExtended } on success*

#### Parameters

| Name | Type | Description |
|---|---|---|
| expiryDate | uint256 | The new expiry date (in UNIX epoch time format) |

### grantMerchantRole

```solidity
function grantMerchantRole(address account) external nonpayable
```

Allows for the granting of merchant roles into an approved merchant list

*Implementation is flexible to different concerns (eg; having the ability to enumerate merchant roles) This should correspond to the restrictions place in the `redeem` function. Emits a { MerchantAdded } on success*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | The address of a merchant to be added into the approved merchant list |

### redeem

```solidity
function redeem(address toUser, uint256 amount) external nonpayable
```

Unwraps the PBM token and transfers to merchant. Function is called by the recipient of PBM tokens.

*This function should specify and enforce the requirements for PBM -&gt; underlying token to take place. For recipient related enforcement, it is recommended to have a modifier in place Underlying token transfer, and proper burning of PBM token supply should also be done here. Emits a { Redemption } on success*

#### Parameters

| Name | Type | Description |
|---|---|---|
| toUser | address | The address of a merchant to receive the unwrapped PBM |
| amount | uint256 | The amount, in PBM tokens, to be redeemed |

### revokeMerchantRole

```solidity
function revokeMerchantRole(address account) external nonpayable
```

Allows for the revoking of already exisiting accounts in the merchant list

*Should revert on failure Emits a { MerchantRevoked } on success*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | The address of a merchant to be revoked from the approved merchant list |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```



*Returns the amount of tokens in existence.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transfer

```solidity
function transfer(address to, uint256 amount) external nonpayable returns (bool)
```



*Moves `amount` tokens from the caller&#39;s account to `to`. Returns a boolean value indicating whether the operation succeeded. Emits a {Transfer} event.*

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



*Moves `amount` tokens from `from` to `to` using the allowance mechanism. `amount` is then deducted from the caller&#39;s allowance. Returns a boolean value indicating whether the operation succeeded. Emits a {Transfer} event.*

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

### withdraw

```solidity
function withdraw() external nonpayable returns (bool)
```

Allows for unused DSGD to be returned back to original owner

*This function should only suceed when the contract&#39;s expiry date has been reached Function should revert, instead of returning `false` on failure Emits a { OwnerWithdrawal } on success*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### wrapMint

```solidity
function wrapMint(address toUser, uint256 amount) external nonpayable
```

Mints PBM token, and consumes underlying token

*This function should be used to handle wrapping and minting logic of PBM against an underlying token*

#### Parameters

| Name | Type | Description |
|---|---|---|
| toUser | address | The address of the recipient receiving the PBM token |
| amount | uint256 | The amount, in PBM tokens, to mint. Same equivalence of underlying token will be wrapped |



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



*Emitted when an expiry has been extended*

#### Parameters

| Name | Type | Description |
|---|---|---|
| admin  | address | The admin account associtated that triggered the extension |

### MerchantAdded

```solidity
event MerchantAdded(address account, address admin)
```



*Emitted when an authorised admin adds a merchant*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | The merchant account that was added |
| admin  | address | The admin associated with the adding of merchant |

### MerchantRevoked

```solidity
event MerchantRevoked(address account, address admin)
```



*Emitted when an authorised admin revokes a merchant*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | The merchant account that was revoked |
| admin  | address | The admin associated with the removal/revoke of a merchant |

### OwnerWithdrawal

```solidity
event OwnerWithdrawal(address account, uint256 amount)
```



*Emitted when a PBM Owner successfully withdraws underlying tokens*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account  | address | The account (PBM Owner) that made a withdrawal |
| amount  | uint256 | The amount of underlying tokens withdrawn from contract |

### Redemption

```solidity
event Redemption(address indexed fromUser, address indexed toUser, uint256 amount)
```



*Emitted after a PBM redemption takes place*

#### Parameters

| Name | Type | Description |
|---|---|---|
| fromUser `indexed` | address | The address of the recipient (person redeeming) |
| toUser `indexed` | address | The address of the merchant (person) |
| amount  | uint256 | The amount being redeemed for |

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



