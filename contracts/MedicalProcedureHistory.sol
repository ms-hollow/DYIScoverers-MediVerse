// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Hospital.sol";

contract MedicalProcedureHistory is HospitalRecords{

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
}   