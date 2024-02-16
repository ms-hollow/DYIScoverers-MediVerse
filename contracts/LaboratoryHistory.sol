// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Patient.sol";
import "./AccessControl.sol";

contract LaboratoryHistoryRecords {

    struct LaboratoryRecord {
        address hospitalAddr;
        string patientID;
        string recordID;
        string hospital;
        string testType; //kung ano type ng test (blood test, urinalysis, etc)
        string dateOfTest;
        string orderingPhysician;
        string testCategory; //kung ano category niya (ex. CBC, CTS, etc)
        string resultsIpfsHash;  // Results (Upload file/IPFS hash)
        string reviewingPhysician;
        string interpretation;
    }

    mapping(string => LaboratoryRecord) public laboratoryRecords;
    mapping(string => string[]) public patientLaboratoryRecords;
    mapping(string => address) public hospitalToPatient;
    mapping(string => mapping(address => bool)) public patientPermissions;

    function addLaboratoryHistory(
        string memory _patientID,
        string memory _recordID,
        string memory _hospital,
        string memory _testType,
        string memory _dateOfTest,
        string memory _orderingPhysician,
        string memory _testCategory,
        string memory _resultsIpfsHash,
        string memory _reviewingPhysician,
        string memory _interpretation
    ) public {

        LaboratoryRecord storage record = laboratoryRecords[_recordID];
        
        record.hospitalAddr = msg.sender;
        record.patientID = _patientID;
        record.recordID = _recordID;
        record.hospital = _hospital;
        record.testType = _testType;
        record.dateOfTest = _dateOfTest;
        record.orderingPhysician = _orderingPhysician;
        record.testCategory = _testCategory;
        record.resultsIpfsHash = _resultsIpfsHash;
        record.reviewingPhysician = _reviewingPhysician;
        record.interpretation = _interpretation;

        patientLaboratoryRecords[_patientID].push(_recordID);
    }

    function editLaboratoryHistory(
        string memory _recordID, 
        string memory _testType, 
        string memory _dateOfTest,
        string memory _orderingPhysician, 
        string memory _testCategory, 
        string memory _resultsIpfsHash,
        string memory _reviewingPhysician,
        string memory _interpretation
    ) public {

        LaboratoryRecord storage record = laboratoryRecords[_recordID];
        require(record.hospitalAddr != address(0), "Record does not exist");
        
        record.testType = _testType;
        record.dateOfTest = _dateOfTest;
        record.orderingPhysician = _orderingPhysician;
        record.testCategory = _testCategory;
        record.resultsIpfsHash = _resultsIpfsHash;
        record.reviewingPhysician = _reviewingPhysician;
        record.interpretation = _interpretation;
    }

    function getAllLaboratoryHistoryRecords(string memory _patientID) public view returns (LaboratoryRecord[] memory) {
        // Check if the hospital has permission to access the patient's records
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");

        string[] memory recordIDs = patientLaboratoryRecords[_patientID];
        LaboratoryRecord[] memory records = new LaboratoryRecord[](recordIDs.length);

        // Retrieve each medical record for the patient
        for (uint i = 0; i < recordIDs.length; i++) {
            records[i] = laboratoryRecords[recordIDs[i]];
        }

        return records;
    }

    function searchLaboratoryRecords(string memory _patientID, string memory _testTypeKeyword, string memory _testCategoryKeyword
        ) public view returns (LaboratoryRecord[] memory) {
        // Check if the user has permission to access this record
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");

        string[] memory recordIDs = patientLaboratoryRecords[_patientID];
        LaboratoryRecord[] memory matchingRecords;
        uint matchingCount = 0;

        // Iterate through each record and check for matching criteria
        for (uint i = 0; i < recordIDs.length; i++) {
            LaboratoryRecord storage record = laboratoryRecords[recordIDs[i]];

            // Check if the record matches the specified criteria
            //`keccak256()` compares the hashes of both strings and returns `true` if they are equal
            if (keccak256(bytes(record.testType)) == keccak256(bytes(_testTypeKeyword)) &&
                (keccak256(bytes(record.testCategory)) == keccak256(bytes(_testCategoryKeyword)))) {
                // Add the matching record to the result array
                if (matchingRecords.length == matchingCount) {
                    // Extend the array if needed
                    matchingRecords = new LaboratoryRecord[](matchingRecords.length + 1);
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


        
