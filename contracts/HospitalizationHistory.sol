// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Hospital.sol";

contract HospitalizationHistoryRecords is HospitalRecords{
    
    struct HospitalizationRecord{
        address owner; //Patient's address
        address hospitalAddr;
        string hospital;
        string admissionDate;
        string dischargeDate;
        string reasonForHospitalization;
        string admittingDiagnosis;
        string dischargeDiagnosis;
    }

    address[] public hospitalizationList;
    mapping(address => HospitalizationRecord) public hospitalizationRecords;
    mapping(address => address[]) public patientHospitalizationRecords;
    uint256 public hospitalizationHistoryCount = 0;

}