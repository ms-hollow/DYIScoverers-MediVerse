// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Hospital.sol";
import "./PermissionLibrary.sol";

contract MedicalProcedureHistory is HospitalRecords{

    using PermissionLibrary for mapping(address => mapping(address => bool));
    mapping(address => mapping(address => bool)) isApprovedToViewProcedureHistory;

    struct ProcedureRecord {
        address owner; //Patient's address
        address hospitalAddr;
        string hospital;
        string procedureType; 
        string procedureDescription;   // Procedure Details
        string procedureComplications;
        string dateOfProcedure; 
        string preOperativeInstructions; 
        string postOperativeCare;   // Post-operative Care
    }

    address[] public procedureHistoryList;
    mapping(address => ProcedureRecord) public procedureRecords;
    mapping(address => address[]) public patientProcedureRecords;
    uint256 public procedureHistoryCount = 0;

    function addMedicalProcedure(
        address _patientAddr,
        string memory _procedureType,
        string memory _procedureDescription,
        string memory _procedureComplications,
        string memory _dateOfProcedure,
        string memory _preOperativeInstructions,
        string memory _postOperativeCare
    ) public {
        require(isHospital[msg.sender]);

        ProcedureRecord storage record = procedureRecords[_patientAddr];

        record.hospitalAddr = msg.sender;
        record.owner = _patientAddr;
        record.procedureType = _procedureType;
        record.procedureDescription = _procedureDescription;
        record.procedureComplications = _procedureComplications;
        record.dateOfProcedure = _dateOfProcedure;
        record.preOperativeInstructions = _preOperativeInstructions;
        record.postOperativeCare = _postOperativeCare;

        patientProcedureRecords[_patientAddr].push(msg.sender);
        procedureHistoryCount++;
   }

   function editMedicalProcedure(
        address _patientAddr,
        string memory _procedureType,
        string memory _procedureDescription,
        string memory _procedureComplications,
        string memory _dateOfProcedure,
        string memory _preOperativeInstructions,
        string memory _postOperativeCare
   ) public {
        
        require(isHospital[msg.sender]);

        ProcedureRecord storage record = procedureRecords[_patientAddr];

        // Check if the record exists and belongs to the specified patient
        require(record.hospitalAddr != address(0), "Record does not exist");
        
        record.hospitalAddr = msg.sender;
        record.owner = _patientAddr;
        record.procedureType = _procedureType;
        record.procedureDescription = _procedureDescription;
        record.procedureComplications = _procedureComplications;
        record.dateOfProcedure = _dateOfProcedure;
        record.preOperativeInstructions = _preOperativeInstructions;
        record.postOperativeCare = _postOperativeCare;
   }

    // Function to retrieve medical history for a specific patient if meron permission
    function getProcedureHistory(address patientAddr) public view returns (MedicalProcedureHistory.ProcedureRecord memory) {
        require(isApprovedToViewProcedureHistory[patientAddr][msg.sender], "Access Denied."); //checker kung may permission
        return MedicalProcedureHistory.procedureRecords[patientAddr];
    }
}   