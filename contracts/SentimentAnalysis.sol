pragma solidity ^0.4.15;

import "./lib/Owned.sol";
import "./lib/SafeMath.sol";

contract SentimentAnalysis is Owned {
  using SafeMath for uint256;
  
  mapping (address => Reputation) reputations;
  
  event ReputationUpdated(string reputation, uint correct, uint incorrect, string lastUpdateDate, string lastFormulaApplied, address user);
  
  struct Reputation {
    string reputation;
    uint correct;
    uint incorrect;
    string lastUpdateDate;
    string lastFormulaApplied;
  }

  function ()  payable {
    revert();
  }

  /// @dev Returns the reputation for the provided user.
  /// @param user The user address to retrieve reputation for.
  function getReputation(
    address user
  ) 
    public
    constant
    returns (string, uint, uint, string, string)
  {
    return (reputations[user].reputation, reputations[user].correct, reputations[user].incorrect, reputations[user].lastUpdateDate, reputations[user].lastFormulaApplied);
  }

  /// @dev Updates the reputation of the provided user
  /// @param reputation The reputation to update
  /// @param correct The number of correct sentiments provided
  /// @param incorrect The number of incorrect sentiments provided
  /// @param date The date the reputation is updated
  /// @param formulaApplied The formula applied to generate the provided reputation
  /// @param user The address of the user whose reputation is updated
  function updateReputation(
    string reputation,
    uint correct,
    uint incorrect,
    string date,
    string formulaApplied,
    address user
  ) 
    onlyOwner
    public
  {
    reputations[user].reputation = reputation;
    reputations[user].correct = correct;
    reputations[user].incorrect = incorrect;
    reputations[user].lastUpdateDate = date;
    reputations[user].lastFormulaApplied = formulaApplied;
    ReputationUpdated(reputations[user].reputation, reputations[user].correct, reputations[user].incorrect, reputations[user].lastUpdateDate, reputations[user].lastFormulaApplied, user);
  }
}