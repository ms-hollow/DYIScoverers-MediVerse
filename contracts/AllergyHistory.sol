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

    function addAllergyHistory(
        address _patientAddr,
        string memory _allergen,
        string memory _allergyType,
        string memory _severity,
        string memory _reaction,
        string memory _dateStarted,
        string memory _lastReactionDate,
        string memory _medications
    ) public {
        require(isHospital[msg.sender]);
        // Set the details of the new medical history record
        AllergyRecord storage record = allergyRecords[_patientAddr];
        
        record.hospitalAddr = msg.sender;
        record.owner = _patientAddr;
        record.allergen = _allergen;
        record.allergyType = _allergyType;
        record.severity = _severity;
        record.reaction = _reaction;
        record.dateStarted = _dateStarted;
        record.lastReactionDate = _lastReactionDate;
        record.medications = _medications;

        // Update patient's history records and increment the total count
        patientAllergyRecords[_patientAddr].push(msg.sender);
        allergyHistoryCount++;
    }

    function editAllergyHistory(
        address _patientAddr,
        string memory _allergen,
        string memory _allergyType,
        string memory _severity,
        string memory _reaction,
        string memory _dateStarted,
        string memory _lastReactionDate,
        string memory _medications
    ) public {
        require(isHospital[msg.sender]);
        // Set the details of the new medical history record
        AllergyRecord storage record = allergyRecords[_patientAddr];
        
         // Check if the record exists and belongs to the specified patient
        require(record.hospitalAddr != address(0), "Record does not exist");

        record.hospitalAddr = msg.sender;
        record.owner = _patientAddr;
        record.allergen = _allergen;
        record.allergyType = _allergyType;
        record.severity = _severity;
        record.reaction = _reaction;
        record.dateStarted = _dateStarted;
        record.lastReactionDate = _lastReactionDate;
        record.medications = _medications;
    }
}