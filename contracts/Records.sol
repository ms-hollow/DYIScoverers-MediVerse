// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Patient.sol";
import "./Hospital.sol";

contract Records is PatientRecords, HospitalRecords {

    constructor() {
        owner = msg.sender;
    }

    struct MedicalHistory {
        address hospitalAddr;
        address patientAddr;
        string physician;
        uint dateOfDiagnosis;
        string diagnosis;  // Additional Diagnostic Information
        string symptoms;    
        string durationSeverity; // Duration and Severity
        string signs; // Signs
        string relevantMedicalHistory;
    }

    struct MedicalProcedure {
        address hospitalAddr;
        address patientAddr;
        string procedureType; 
        string hospital;
        string medicalTeam;
        string procedureDescription;
        string procedureComplications;
        string dateOfProcedure;
        string preOperativeInstructions;     
        string medication;
        string purpose;
    }

    struct LaboratoryHistory {
        address hospitalAddr;
        address patientAddr;
        string testType; //kung ano type ng test (blood test, urinalysis, etc)
        string hospital;
        uint dateOfTest;
        string orderingPhysician; // Test Details
        string testCategory; //kung ano category niya (ex. CBC, CTS, etc)
        string resultsIpfsHash;  // Results (Upload file/IPFS hash)
        string reviewingPhysician;
        string interpretation;
    }

    struct HospitalizationRecord {
        address hospitalAddr;
        address patientAddr;
        string admissionDate;
        string dischargeDate;
        string reasonForHospitalization;
        string admittingDiagnosis;
        string dischargeDiagnosis;
        string hospitalName;
    }

    address public owner; // Address of the owner of the contract
    address[] public medicalHistories;
    address[] public medicalProcedures;
    address[] public medicationPrescriptions;
    address[] public laboratoryHistories;
    address[] public hospitalizationRecords;

    // Mapping to associate addresses with structs
    mapping(address => MedicalHistory) public medicalHistory;
    mapping(address => MedicalProcedure) public medicalProcedure;
    mapping(address => LaboratoryHistory) public laboratoryHistory;
    mapping(address => HospitalizationRecord) public hospitalizationRecord;

    //Retrieve a list of all patients address
    function getPatients() public view returns(address[] memory) {
        return patientList;
    }

    //Retrieve a list of all doctors address
    function getHospitals() public view returns(address[] memory) {
        return hospitalList;
    }

    function addNewPatientMedicalHistory(MedicalHistory memory newRecord) public {
    require(!isHospital[msg.sender], "Only hospitals are allowed to add records.");  // Only hospitals should have medical history records
    require(!isPatient[newRecord.patientAddr], "Patient address is already registered.");

    newRecord.hospitalAddr = msg.sender;

    medicalHistories.push(newRecord.patientAddr); // Add the patient's address to the list of medical histories
    medicalHistory[newRecord.patientAddr] = newRecord; // Store the medical history record in the mapping
    }

    /**
    Note: Size of the contract code exceeds the limit of 24,576 bytes
    -----HOSPITAL-----
    addNewPatientMedicalProcedure
    addNewPatientLaboratoryRecord
    addNewPatientHospitalizationRecord
    editPatientMedicalHistory
    editPatientMedicalProcedure
    editPatientHospitalizationRecord
    searchRecords
    getAllRecords
    */
}
