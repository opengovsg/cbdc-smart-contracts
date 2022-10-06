// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleMerchant is Ownable {
    mapping(address => string) public addressToShopName;

    event MerchantSet(address indexed account, address admin, string name);
    event MerchantDeleted(address indexed account, address admin);

    function setMerchant(address account, string memory name) public onlyOwner {
        addressToShopName[account] = name;
        emit MerchantSet(account, _msgSender(), name);
    }

    function deleteMerchant(address account) public onlyOwner {
        delete addressToShopName[account];
        emit MerchantDeleted(account, _msgSender());
    }

    function getMerchant(address account) public view returns (string memory) {
        return addressToShopName[account];
    }
}
