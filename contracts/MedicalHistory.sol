// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Hospital.sol";
import "./PermissionLibrary.sol";

contract MedicalHistoryRecords is HospitalRecords {

    using PermissionLibrary for mapping(address => mapping(address => bool));
    mapping(address => mapping(address => bool)) isApprovedToViewMedicalHistory;

    // Structure to store medical history record details
    struct HistoryRecord {
        address owner; //Patient's address
        address hospitalAddr;
        string hospital;
        string physician;
        string dateOfDiagnosis;
        string diagnosis;
        string symptoms;
        string durationSeverity;
        string signs;
        string relevantMedicalHistory;
    }   
    
    address[] public medicalHistoryList;
    mapping(address => HistoryRecord) public historyRecords;
    mapping(address => address[]) public patientHistoryRecords;
    uint256 public medicalHistoryCount = 0;
    
    // Event emitted when a medical history record is added
    event MedicalHistoryRecordAdded(address patientAddr);

    // Event emitted when a medical history record is edited
    event MedicalHistoryRecordEdited(address patientAddr);

    function addMedicalHistory(
        address _patientAddr,
        string memory _physician,
        string memory _hospital,
        string memory _dateOfDiagnosis,
        string memory _diagnosis,
        string memory _symptoms,
        string memory _durationSeverity,
        string memory _signs,
        string memory _relevantMedicalHistory
    ) public {

        require(isHospital[msg.sender]);
        // Set the details of the new medical history record
        HistoryRecord storage record = historyRecords[_patientAddr];
        
        record.hospitalAddr = msg.sender;
        record.owner = _patientAddr;
        record.hospital = _hospital;
        record.physician = _physician;
        record.dateOfDiagnosis = _dateOfDiagnosis;
        record.diagnosis = _diagnosis;
        record.symptoms = _symptoms;
        record.durationSeverity = _durationSeverity;
        record.signs = _signs;
        record.relevantMedicalHistory = _relevantMedicalHistory;

        // Update patient's history records and increment the total count
        patientHistoryRecords[_patientAddr].push(msg.sender);
        medicalHistoryCount++;

        // Emit the event after modifying the historyRecords mapping
        emit MedicalHistoryRecordAdded(_patientAddr);
    }

    function editMedicalHistory(
        address _patientAddr,
        string memory _physician,
        string memory _hospital,
        string memory _dateOfDiagnosis,
        string memory _diagnosis,
        string memory _symptoms,
        string memory _durationSeverity,
        string memory _signs,
        string memory _relevantMedicalHistory
    ) public {
        require(isHospital[msg.sender]);
        // Retrieve the record from storage
        HistoryRecord storage record = historyRecords[_patientAddr];

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

        // Emit the event after modifying the record
        emit MedicalHistoryRecordEdited(_patientAddr);
    }

    // Function to retrieve medical history for a specific patient if meron permission
    function getMedicalHistory(address patientAddr) public view returns (MedicalHistoryRecords.HistoryRecord memory) {
        require(isApprovedToViewMedicalHistory[patientAddr][msg.sender], "Access Denied."); //checker kung may permission
        return MedicalHistoryRecords.historyRecords[patientAddr];
    }
}
