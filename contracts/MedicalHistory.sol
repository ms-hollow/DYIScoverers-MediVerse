// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Patient.sol";
import "./Hospital.sol";

contract MedicalHistoryRecords {
    
    struct HistoryRecord {
        address hospitalAddr;
        string patientID;
        string recordID;
        string physician;
        uint dateOfDiagnosis;
        string diagnosis;
        string symptoms;
        string durationSeverity;
        string signs;
        string relevantMedicalHistory;
    }

    mapping(string => HistoryRecord) public historyRecords;
    mapping(string => string[]) public patientHistoryRecords;
    mapping(string => address) public hospitalToPatient; 
    mapping(address => bool) public isPatient;

    event MedicalHistoryRecordAdded(string recordID, string patientID);
    event MedicalHistoryRecordEdited(string recordID, string patientID);

    function addMedicalHistory(
        string memory _patientID,
        string memory _recordID,
        string memory _physician,
        uint _dateOfDiagnosis,
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

    function editMedicalHistory(string memory _recordID, string memory _physician, uint _dateOfDiagnosis, string memory _diagnosis, 
    string memory _symptoms, string memory _durationSeverity, string memory _signs, string memory _relevantMedicalHistory) public {
    
        // Retrieve the record from storage
        HistoryRecord storage record = historyRecords[_recordID];

        // Check if the record exists and belongs to the specified patient
        require(record.hospitalAddr != address(0), "Record does not exist");

        // Update the record with the new information
        record.physician = _physician;
        record.dateOfDiagnosis = _dateOfDiagnosis;
        record.diagnosis = _diagnosis;
        record.symptoms = _symptoms;
        record.durationSeverity = _durationSeverity;
        record.signs = _signs;
        record.relevantMedicalHistory = _relevantMedicalHistory;

        // Debugging log
        emit MedicalHistoryRecordEdited(_recordID, record.patientID);
    }

    // Retrieve and medical record
    function getMedicalHistoryRecords(string memory _patientID) public view returns (string[] memory) {
        return patientHistoryRecords[_patientID];
    }
}
