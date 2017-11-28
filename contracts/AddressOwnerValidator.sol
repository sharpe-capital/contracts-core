pragma solidity ^0.4.15;

import "./lib/SafeMath.sol";

contract AddressOwnerValidator {
  using SafeMath for uint256;
  
  uint256 private gas;
  mapping (address => Transfer) private transfers;
  
  event RefundTransfer(uint256 date, uint256 paid, uint256 usedGas, uint256 refunded, address user);
  
  struct Transfer {
    uint256 date;
    uint256 amount;
  }

  function AddressOwnerValidator(uint256 _gas) payable {
    gas = _gas;
  }

  function ()  payable {
    if (transfers[msg.sender].date == 0) {
      uint256 usedGas = gas.sub(msg.gas);
      uint256 toRefund = usedGas.add(msg.value);
      
      transfers[msg.sender] = Transfer(now, msg.value);
      
      msg.sender.transfer(toRefund);
      
      RefundTransfer(now, msg.value, usedGas, toRefund, msg.sender);
    } else {
      // address has already been verified
      revert();
    }
  }

  function validateUser(address user)  public constant returns (uint256, uint256) {
    return (transfers[user].date, transfers[user].amount);
  }
}