// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Patient.sol";
import "./AccessControl.sol";

contract HospitalizationHistoryRecords {
    
    struct HospitalizationRecord{
        address hospitalAddr;
        string patientID;
        string recordID;
        string hospital;
        string admissionDate;
        string dischargeDate;
        string reasonForHospitalization;
        string admittingDiagnosis;
        string dischargeDiagnosis;
    }

    mapping(string => HospitalizationRecord) public hospitalizationRecords;
    mapping(string => string[]) public patientHospitalizationRecords;
    mapping(string => address) public hospitalToPatient;
    mapping(string => mapping(address => bool)) public patientPermissions;

    function addHospitalizationHistory(
        string memory _patientID,
        string memory _recordID,
        string memory _hospital,
        string memory _admissionDate,
        string memory _dischargeDate,
        string memory _reasonForHospitalization,
        string memory _admittingDiagnosis,
        string memory _dischargeDiagnosis
    ) public {

        HospitalizationRecord storage record = hospitalizationRecords[_recordID];

        record.hospitalAddr = msg.sender;
        record.patientID = _patientID;
        record.recordID = _recordID;
        record.hospital = _hospital;
        record.admissionDate = _admissionDate;
        record.dischargeDate = _dischargeDate;
        record.reasonForHospitalization = _reasonForHospitalization;
        record.admittingDiagnosis = _admittingDiagnosis;
        record.dischargeDiagnosis = _dischargeDiagnosis;

        patientHospitalizationRecords[_patientID].push(_recordID);
    }

    function editHospitalizationHistory(
        string memory _recordID,
        string memory _admissionDate,
        string memory _dischargeDate,
        string memory _reasonForHospitalization,
        string memory _admittingDiagnosis,
        string memory _dischargeDiagnosis
    ) public {

        HospitalizationRecord storage record = hospitalizationRecords[_recordID];
        require(record.hospitalAddr != address(0), "Record does not exist");

        record.admissionDate = _admissionDate;
        record.dischargeDate = _dischargeDate;
        record.reasonForHospitalization = _reasonForHospitalization;
        record.admittingDiagnosis = _admittingDiagnosis;
        record.dischargeDiagnosis =  _dischargeDiagnosis;
    }

    function getAllHospitalizationHistoryRecords(string memory _patientID) public view returns (HospitalizationRecord[] memory) {
        // Check if the hospital has permission to access the patient's records
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");

        string[] memory recordIDs = patientHospitalizationRecords[_patientID];
        HospitalizationRecord[] memory records = new HospitalizationRecord[](recordIDs.length);

        // Retrieve each medical record for the patient
        for (uint i = 0; i < recordIDs.length; i++) {
            records[i] = hospitalizationRecords[recordIDs[i]];
        }

        return records;
    }

    function searchHospitalizationRecords(string memory _patientID, string memory _reasonForHospitalizationKeyword
        ) public view returns (HospitalizationRecord[] memory) {
        // Check if the user has permission to access this record
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");

        string[] memory recordIDs = patientHospitalizationRecords[_patientID];
        HospitalizationRecord[] memory matchingRecords;
        uint matchingCount = 0;

        // Iterate through each record and check for matching criteria
        for (uint i = 0; i < recordIDs.length; i++) {
                HospitalizationRecord storage record = hospitalizationRecords[recordIDs[i]];

            // Check if the record matches the specified criteria
            //`keccak256()` compares the hashes of both strings and returns `true` if they are equal
            if (keccak256(bytes(record.reasonForHospitalization)) == keccak256(bytes(_reasonForHospitalizationKeyword))) {
                // Add the matching record to the result array
                if (matchingRecords.length == matchingCount) {
                    // Extend the array if needed
                    matchingRecords = new HospitalizationRecord[](matchingRecords.length + 1);
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