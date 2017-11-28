pragma solidity ^0.4.15;

import "./lib/SafeMath.sol";

contract AddressOwnerValidator {
  using SafeMath for uint256;
  
  uint256 public gas;
  mapping (address => uint256) public transfers;
  
  event RefundTransfer(uint256 date, uint256 paid, uint256 usedGas, uint256 refunded, address user);
  
  function AddressOwnerValidator(uint256 _gas) payable {
    gas = _gas;
  }

  function ()  payable {
    require(msg.value > 0);
    
    uint256 usedGas = gas.sub(msg.gas);
    uint256 toRefund = usedGas.add(msg.value);
    
    transfers[msg.sender] = msg.value;
    
    msg.sender.transfer(toRefund);
    
    RefundTransfer(now, msg.value, usedGas, toRefund, msg.sender);
  }
}