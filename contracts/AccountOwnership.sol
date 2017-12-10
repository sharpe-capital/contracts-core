pragma solidity ^0.4.15;

import "./lib/SafeMath.sol";
import "./lib/Owned.sol";

contract AccountOwnership is Owned {
  using SafeMath for uint256;
  
  mapping (address => uint256) public transfers;
  address public depositAddress;
  
  event RefundTransfer(uint256 date, uint256 paid, uint256 refunded, address user);
  
  function AccountOwnership() payable {
  }

  function withdrawEther (address _to) onlyOwner {
    _to.transfer(this.balance);
  }

  function setDepositAddress(address _depositAddress) onlyOwner {
    depositAddress = _depositAddress;
  }

  function ()  payable {
    require(msg.value > 0);
    if (depositAddress != msg.sender) {
      transfers[msg.sender] = msg.value;
      msg.sender.transfer(msg.value);
      RefundTransfer(now, msg.value, msg.value, msg.sender);
    }
  }
}