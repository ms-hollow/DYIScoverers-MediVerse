// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Hospital.sol";
import "./PermissionLibrary.sol";

contract HospitalizationHistoryRecords is HospitalRecords{

    using PermissionLibrary for mapping(address => mapping(address => bool));
    mapping(address => mapping(address => bool)) isApprovedToViewHospitalization;
    
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

    function addHospitalizationHistory(
        address _patientAddr,
        string memory _hospital,
        string memory _admissionDate,
        string memory _dischargeDate,
        string memory _reasonForHospitalization,
        string memory _admittingDiagnosis,
        string memory _dischargeDiagnosis
    ) public {
        require(isHospital[msg.sender]);
        // Set the details of the new medical history record
        HospitalizationRecord storage record = hospitalizationRecords[_patientAddr];
        
        record.hospitalAddr = msg.sender;
        record.owner = _patientAddr;
        record.hospital = _hospital;
        record.admissionDate = _admissionDate;
        record.dischargeDate = _dischargeDate;
        record.reasonForHospitalization = _reasonForHospitalization;
        record.admittingDiagnosis = _admittingDiagnosis;
        record.dischargeDiagnosis = _dischargeDiagnosis;

        // Update patient's history records and increment the total count
        patientHospitalizationRecords[_patientAddr].push(msg.sender);
        hospitalizationHistoryCount++;
    }

    function editHospitalizationHistory(
        address _patientAddr,
        string memory _hospital,
        string memory _admissionDate,
        string memory _dischargeDate,
        string memory _reasonForHospitalization,
        string memory _admittingDiagnosis,
        string memory _dischargeDiagnosis
    ) public {
        require(isHospital[msg.sender]);
        // Set the details of the new medical history record
        HospitalizationRecord storage record = hospitalizationRecords[_patientAddr];

        // Check if the record exists and belongs to the specified patient
        require(record.hospitalAddr != address(0), "Record does not exist");
        
        record.hospitalAddr = msg.sender;
        record.owner = _patientAddr;
        record.hospital = _hospital;
        record.admissionDate = _admissionDate;
        record.dischargeDate = _dischargeDate;
        record.reasonForHospitalization = _reasonForHospitalization;
        record.admittingDiagnosis = _admittingDiagnosis;
        record.dischargeDiagnosis = _dischargeDiagnosis;
    }

     // Function to retrieve medical history for a specific patient if meron permission
    function getHospitalizationHistory(address patientAddr) public view returns (HospitalizationHistoryRecords.HospitalizationRecord memory) {
        require(isApprovedToViewHospitalization[patientAddr][msg.sender], "Access Denied."); //checker kung may permission
        return HospitalizationHistoryRecords.hospitalizationRecords[patientAddr];
    }
}