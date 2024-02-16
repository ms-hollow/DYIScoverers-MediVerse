// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Patient.sol";
import "./AccessControl.sol";

contract MedicalProcedureHistory {

    struct ProcedureRecord {
        address hospitalAddr;
        string hospital;
        string patientID;
        string recordID;
        string procedureType; 
        string procedureDescription;   // Procedure Details
        string procedureComplications;
        string dateOfProcedure; 
        string preOperativeInstructions; 
        string postOperativeCare;   // Post-operative Care
    }

    mapping(string => ProcedureRecord) public procedureRecords;
    mapping(string => string[]) public patientProcedureRecords;
    mapping(string => address) public hospitalToPatient;
    // Mapping to store patient permissions
    mapping(string => mapping(address => bool)) public patientPermissions;

    function addProcedureRecord(
        string memory _hospital, 
        string memory _patientID,
        string memory _recordID,
        string memory _procedureType,
        string memory _procedureDescription,
        string memory _procedureComplications,
        string memory _dateOfProcedure,
        string memory _preOperativeInstructions,
        string memory _postOperativeCare
    ) public {

        ProcedureRecord storage record = procedureRecords[_recordID];

        record.hospitalAddr = msg.sender;
        record.hospital = _hospital;
        record.patientID = _patientID;
        record.recordID = _recordID;
        record.procedureType = _procedureType;
        record.procedureDescription = _procedureDescription;
        record.procedureComplications = _procedureComplications;
        record.dateOfProcedure = _dateOfProcedure;
        record.preOperativeInstructions = _preOperativeInstructions;
        record.postOperativeCare = _postOperativeCare;
    }

    function editProcedureHistory(
    string memory _recordID, 
        string memory _procedureType, 
        string memory _procedureDescription,
        string memory _procedureComplications,
        string memory _dateOfProcedure,
        string memory _preOperativeInstructions,
        string memory _postOperativeCare
    ) public {

        ProcedureRecord storage record = procedureRecords[_recordID];
        require(record.hospitalAddr != address(0), "Record does not exist");

        record.procedureType = _procedureType;
        record.procedureDescription = _procedureDescription;
        record.procedureComplications = _procedureComplications;
        record.dateOfProcedure = _dateOfProcedure;
        record.preOperativeInstructions = _preOperativeInstructions;
        record.postOperativeCare = _postOperativeCare;
    }

    function getAllProcedureHistoryRecords(string memory _patientID) public view returns (ProcedureRecord[] memory) {
        
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");
        string[] memory recordIDs = patientProcedureRecords[_patientID];
        ProcedureRecord[] memory records = new ProcedureRecord[](recordIDs.length);

        for (uint i = 0; i < recordIDs.length; i++){
            records[i] = procedureRecords[recordIDs[i]];
        }
        return records;    
    }

    function searchProcedureRecords(string memory _patientID, string memory _procedureTypeKeyword
        ) public view returns (ProcedureRecord[] memory) {
        // Check if the user has permission to access this record
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");

        string[] memory recordIDs = patientProcedureRecords[_patientID];
        ProcedureRecord[] memory matchingRecords;
        uint matchingCount = 0;

        // Iterate through each record and check for matching criteria
        for (uint i = 0; i < recordIDs.length; i++) {
            ProcedureRecord storage record = procedureRecords[recordIDs[i]];

            // Check if the record matches the specified criteria
            //`keccak256()` compares the hashes of both strings and returns `true` if they are equal
            if (keccak256(bytes(record.procedureType)) == keccak256(bytes(_procedureTypeKeyword)))  {
                // Add the matching record to the result array
                if (matchingRecords.length == matchingCount) {
                    // Extend the array if needed
                    matchingRecords = new ProcedureRecord[](matchingRecords.length + 1);
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