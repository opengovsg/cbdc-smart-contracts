// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract DSGDToken is ERC20Pausable {
    address public immutable owner;
    uint8 public constant DECIMALS = 18;

    constructor() ERC20("DSGD Token", "DSGD") {
        owner = msg.sender;
    }

    function mint(address _recipient, uint256 _amount) external onlyOwner {
        // TODO: Consider having minting restricted to not be to self
        _mint(_recipient, _amount);
    }

    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // TODO: Rethink this. Used for payouts
    // Consider having a payout mapping? Seperate contract account?
    function burn(uint256 _amount) public onlyOwner {
        _burn(owner, _amount);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
}
