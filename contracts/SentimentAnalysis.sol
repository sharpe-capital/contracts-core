pragma solidity ^0.4.6;

contract SentimentAnalysis {

  mapping (address => Score[]) scores;

  struct Score {
    uint8 reputation;
    string dateProvided;
  }

  function ()  payable {
    require(1 == 0);
  }
}