pragma solidity ^0.4.15;

import "./lib/Owned.sol";
import "./lib/SafeMath.sol";

contract SentimentAnalysis is Owned {
  using SafeMath for uint256;
  
  mapping (address => Reputation) reputations;
  
  event ReputationUpdated(
    string nonLinearReputation,
    string linearReputation, 
    uint correct, 
    uint incorrect, 
    string lastUpdateDate, 
    string nonLinearReputationFormula, 
    string linearReputationFormula, 
    address user
  );
  
  struct Reputation {
    string nonLinearReputation;
    string linearReputation;
    uint correct;
    uint incorrect;
    string lastUpdateDate;
    string nonLinearReputationFormula;
    string linearReputationFormula;
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
    returns (string, string, uint, uint, string, string, string)
  {
    return (reputations[user].nonLinearReputation, reputations[user].linearReputation, reputations[user].correct, reputations[user].incorrect, reputations[user].lastUpdateDate, reputations[user].nonLinearReputationFormula, reputations[user].linearReputationFormula);
  }

  /// @dev Updates the reputation of the provided user
  /// @param nonLinearReputation The non-linear reputation to update
  /// @param linearReputation The linear reputation to update
  /// @param correct The number of correct sentiments provided
  /// @param incorrect The number of incorrect sentiments provided
  /// @param date The date the reputation is updated
  /// @param nonLinearReputationFormula The non-linear formula applied to generate the provided non-linear reputation
  /// @param linearReputationFormula The linear formula applied to generate the provided linear reputation
  /// @param user The address of the user whose reputation is updated
  function updateReputation(
    string nonLinearReputation,
    string linearReputation,
    uint correct,
    uint incorrect,
    string date,
    string nonLinearReputationFormula,
    string linearReputationFormula,
    address user
  ) 
    onlyOwner
    public
  {
    reputations[user].nonLinearReputation = nonLinearReputation;
    reputations[user].linearReputation = linearReputation;
    reputations[user].correct = correct;
    reputations[user].incorrect = incorrect;
    reputations[user].lastUpdateDate = date;
    reputations[user].nonLinearReputationFormula = nonLinearReputationFormula;
    reputations[user].linearReputationFormula = linearReputationFormula;
    ReputationUpdated(reputations[user].nonLinearReputation, reputations[user].linearReputation, reputations[user].correct, reputations[user].incorrect, reputations[user].lastUpdateDate, reputations[user].nonLinearReputationFormula, reputations[user].linearReputationFormula, user);
  }
}