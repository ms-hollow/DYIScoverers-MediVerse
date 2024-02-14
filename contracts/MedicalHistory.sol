// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Patient.sol";

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
    // Mapping to store patient permissions
    mapping(string => mapping(address => bool)) public patientPermissions;

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

    // Retrieve medical for specific patient
    // pwede gamitin ng hospital & patient when searching for specific patient record
    function getMedicalHistoryRecords(string memory _patientID) public view returns (string[] memory) {
        return patientHistoryRecords[_patientID];
    }
    
    /**
    > patient can revoke access to the medical records (revokeAccess)
    > patient can give permission to view the contract (givePermission)

    >hospital can retrieve all medical history of the patients if they have a permission, so in general they can retrieve all the medical records of the patient
    >hospital can search medical records based on the medical records
    */
    /**
    Sa backend&frontend dapat automatic malagay sa _patientID kung sino ang patient na currently
    naka logged in para lalagay niya nalang yung address ng hospital
    */
    function revokeAccess(string memory _patientID, address _hospitalAddr) public {
        // Check if the patient has given permission to the specified hospital
        require(patientPermissions[_patientID][_hospitalAddr], "Permission not granted");

        // Revoke access by setting the permission to false
        patientPermissions[_patientID][_hospitalAddr] = false;
    }

    function givePermission(string memory _patientID, address _hospitalAddr) public {
        // Grant access by setting the permission to true
        patientPermissions[_patientID][_hospitalAddr] = true;
        }

        function getAllMedicalHistoryRecordsForHospital(string memory _patientID) public view returns (HistoryRecord[] memory) {
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
        //check if the user has permission to access this record
        require(patientPermissions[_patientID][msg.sender], "Permission not granted");

        string[] memory recordIDs = patientHistoryRecords[_patientID];
        HistoryRecord[] memory matchingRecords;
        uint matchingCount = 0;

        // Iterate through each record and check for matching criteria
        for (uint i = 0; i < recordIDs.length; i++) {
            HistoryRecord storage record = historyRecords[recordIDs[i]];

            // Check if the record matches the specified criteria
            if (
                containsIgnoreCase(record.diagnosis, _diagnosisKeyword) &&
                containsIgnoreCase(record.symptoms, _symptomsKeyword)
            ) {
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

    function containsIgnoreCase(string memory _haystack, string memory _needle) internal pure returns (bool) {
        return (bytes(_haystack).length >= bytes(_needle).length) &&
            (keccak256(abi.encodePacked(_haystack)) == keccak256(abi.encodePacked(_needle)));
    }
}
