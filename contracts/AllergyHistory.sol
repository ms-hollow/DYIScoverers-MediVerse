// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Patient.sol";
import "./AccessControl.sol";

contract AllergyHistoryRecords {

    struct AllergyRecord {
        address hospitalAddr;
        string patientID;
        string recordID;
        string allergen;
        string allergyType; // ex. Drug Allergy, Food Allergy, Environmental Allergy, Insect Sting Allergy
        string severity;
        string reaction;
        string dateStarted;
        string lastReactionDate;
        string medications;
    }

    mapping(string => AllergyRecord) public allergyRecords;
    mapping(string => string[]) public patientAllergyRecords;
    mapping(string => address) public hospitalToPatient;
    mapping(string => mapping(address => bool)) public patientPermissions;

    function addAllergyHistory(
        string memory _patientID,
        string memory _recordID,
        string memory _allergen,
        string memory _allergyType,
        string memory _severity,
        string memory _reaction,
        string memory _dateStarted,
        string memory _lastReactionDate,
        string memory _medications
    ) public {
        AllergyRecord storage record = allergyRecords[_recordID];
        
        record.hospitalAddr = msg.sender;
        record.patientID = _patientID;
        record.recordID = _recordID;
        record.allergen = _allergen;
        record.allergyType = _allergyType;
        record.severity = _severity;
        record.reaction = _reaction;
        record.dateStarted = _dateStarted;
        record.lastReactionDate = _lastReactionDate;
        record.medications = _medications;

        patientAllergyRecords[_patientID].push(_recordID);
    }

    function editAllergyHistory(
        string memory _recordID,
        string memory _allergen,
        string memory _allergyType,
        string memory _severity,
        string memory _reaction,
        string memory _dateStarted,
        string memory _lastReactionDate,
        string memory _medications
    ) public {
        
        AllergyRecord storage record = allergyRecords[_recordID];
        require(record.hospitalAddr != address(0), "Record does not exist");
        
        record.allergen = _allergen;
        record.allergyType = _allergyType;
        record.severity = _severity;
        record.reaction = _reaction;
        record.dateStarted = _dateStarted;
        record.lastReactionDate = _lastReactionDate;
        record.medications = _medications;
    }

    function getAllLaboratoryHistoryRecords(string memory _patientID) public view returns (AllergyRecord[] memory) {
        // Check if the hospital has permission to access the patient's records
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");

        string[] memory recordIDs = patientAllergyRecords[_patientID];
        AllergyRecord[] memory records = new AllergyRecord[](recordIDs.length);

        // Retrieve each medical record for the patient
        for (uint i = 0; i < recordIDs.length; i++) {
            records[i] = allergyRecords[recordIDs[i]];
        }

        return records;
    }

    function searchLaboratoryRecords(string memory _patientID, string memory _allergenKeyword, string memory _allergyTypeKeyword
        ) public view returns (AllergyRecord[] memory) {
        // Check if the user has permission to access this record
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");

        string[] memory recordIDs = patientAllergyRecords[_patientID];
        AllergyRecord[] memory matchingRecords;
        uint matchingCount = 0;

        // Iterate through each record and check for matching criteria
        for (uint i = 0; i < recordIDs.length; i++) {
            AllergyRecord storage record = allergyRecords[recordIDs[i]];

            // Check if the record matches the specified criteria
            //`keccak256()` compares the hashes of both strings and returns `true` if they are equal
            if (keccak256(bytes(record.allergen)) == keccak256(bytes(_allergenKeyword)) &&
                (keccak256(bytes(record.allergyType)) == keccak256(bytes(_allergyTypeKeyword)))) {
                // Add the matching record to the result array
                if (matchingRecords.length == matchingCount) {
                    // Extend the array if needed
                    matchingRecords = new AllergyRecord[](matchingRecords.length + 1);
                }
                matchingRecords[matchingCount++] = record;
            }
        }
        // Resize the array to remove unused slots
        assembly {
            mstore(matchingRecords, matchingCount)
        }
        return matchingRecords;
    }
}