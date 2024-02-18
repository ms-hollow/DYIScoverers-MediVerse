// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Hospital.sol";

contract AllergyHistoryRecords is HospitalRecords {

    struct AllergyRecord {
        address owner; //Patient's address
        address hospitalAddr;
        string allergen;
        string allergyType; // ex. Drug Allergy, Food Allergy, Environmental Allergy, Insect Sting Allergy
        string severity;
        string reaction;
        string dateStarted;
        string lastReactionDate;
        string medications;
    }

    address[] public allergyHistoryList;
    mapping(address => AllergyRecord) public allergyRecords;
    mapping(address => address[]) public patientAllergyRecords;
    uint256 public allergyHistoryCount = 0;

}