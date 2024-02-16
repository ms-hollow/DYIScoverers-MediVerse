// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Patient.sol";
import "./AccessControl.sol";

contract MedicalHistoryRecords {
    
    struct HistoryRecord {
        address hospitalAddr;
        string patientID;
        string recordID;
        string hospital;
        string physician;
        string dateOfDiagnosis;
        string diagnosis;
        string symptoms;
        string durationSeverity;
        string signs;
        string relevantMedicalHistory;
    }

    mapping(string => HistoryRecord) public historyRecords;
    mapping(string => string[]) public patientHistoryRecords;
    mapping(string => address) public hospitalToPatient; 
    // Mapping to store patient permissions
    mapping(string => mapping(address => bool)) public patientPermissions;

    event MedicalHistoryRecordAdded(string recordID, string patientID);
    event MedicalHistoryRecordEdited(string recordID, string patientID);

    //Only hospital can add/edit records
    function addMedicalHistory(
        string memory _patientID,
        string memory _recordID,
        string memory _physician,
        string memory _hospital,
        string memory _dateOfDiagnosis,
        string memory _diagnosis,
        string memory _symptoms,
        string memory _durationSeverity,
        string memory _signs,
        string memory _relevantMedicalHistory
    ) public {
        
        // Debugging log
        emit MedicalHistoryRecordAdded(_recordID, _patientID);

        HistoryRecord storage record = historyRecords[_recordID];
        
        record.hospitalAddr = msg.sender;
        record.patientID = _patientID;
        record.recordID = _recordID;
        record.hospital = _hospital;
        record.physician = _physician;
        record.dateOfDiagnosis = _dateOfDiagnosis;
        record.diagnosis = _diagnosis;
        record.symptoms = _symptoms;
        record.durationSeverity = _durationSeverity;
        record.signs = _signs;
        record.relevantMedicalHistory = _relevantMedicalHistory;

        patientHistoryRecords[_patientID].push(_recordID);

        // Debugging log
        emit MedicalHistoryRecordAdded(_recordID, _patientID);
    }

    function editMedicalHistory(string memory _recordID, string memory _physician, string memory _hospital, string memory _dateOfDiagnosis, string memory _diagnosis, 
    string memory _symptoms, string memory _durationSeverity, string memory _signs, string memory _relevantMedicalHistory) public {
    
        // Retrieve the record from storage
        HistoryRecord storage record = historyRecords[_recordID];

        // Check if the record exists and belongs to the specified patient
        require(record.hospitalAddr != address(0), "Record does not exist");

        // Update the record with the new information
        record.physician = _physician;
        record.hospital = _hospital;
        record.dateOfDiagnosis = _dateOfDiagnosis;
        record.diagnosis = _diagnosis;
        record.symptoms = _symptoms;
        record.durationSeverity = _durationSeverity;
        record.signs = _signs;
        record.relevantMedicalHistory = _relevantMedicalHistory;

        // Debugging log
        emit MedicalHistoryRecordEdited(_recordID, record.patientID);
    }

    // Retrieve medical for specific patient
    // pwede gamitin ng hospital & patient when searching for specific patient record
    /*
    function getMedicalHistoryRecords(string memory _patientID) public view returns (string[] memory) {
        return patientHistoryRecords[_patientID];
    }
    */
    /**
    > patient can revoke access to the medical records (revokeAccess)
    > patient can give permission to view the contract (givePermission)

    >hospital can retrieve all medical history of the patients if they have a permission, so in general they can retrieve all the medical records of the patient
    >hospital can search medical records based on the medical records
    */
    
    /*
    Sa backend&frontend dapat automatic malagay sa _patientID kung sino ang patient na currently
    naka logged in para lalagay niya nalang yung address ng hospital
    */
    function getAllMedicalHistoryRecords(string memory _patientID) public view returns (HistoryRecord[] memory) {
        // Check if the hospital has permission to access the patient's records
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");

        string[] memory recordIDs = patientHistoryRecords[_patientID];
        HistoryRecord[] memory records = new HistoryRecord[](recordIDs.length);

        // Retrieve each medical record for the patient
        for (uint i = 0; i < recordIDs.length; i++) {
            records[i] = historyRecords[recordIDs[i]];
        }

        return records;
    }
    
    function searchMedicalRecords(string memory _patientID, string memory _diagnosisKeyword, string memory _symptomsKeyword
        ) public view returns (HistoryRecord[] memory) {
        // Check if the user has permission to access this record
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");

        string[] memory recordIDs = patientHistoryRecords[_patientID];
        HistoryRecord[] memory matchingRecords;
        uint matchingCount = 0;

        // Iterate through each record and check for matching criteria
        for (uint i = 0; i < recordIDs.length; i++) {
            HistoryRecord storage record = historyRecords[recordIDs[i]];

            // Check if the record matches the specified criteria
            //`keccak256()` compares the hashes of both strings and returns `true` if they are equal
            if (keccak256(bytes(record.diagnosis)) == keccak256(bytes(_diagnosisKeyword)) &&
                (keccak256(bytes(record.symptoms)) == keccak256(bytes(_symptomsKeyword)))) {
                // Add the matching record to the result array
                if (matchingRecords.length == matchingCount) {
                    // Extend the array if needed
                    matchingRecords = new HistoryRecord[](matchingRecords.length + 1);
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
