// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Patient.sol";
import "./Hospital.sol";
import "./MedicalHistory.sol";
import "./MedicalProcedureHistory.sol";
import "./LaboratoryHistory.sol";
import "./HospitalizationHistory.sol";
import "./AllergyHistory.sol";

//Main Contract
contract Record is PatientRecords, HospitalRecords, MedicalHistoryRecords, MedicalProcedureHistory, 
    LaboratoryHistoryRecords, HospitalizationHistoryRecords, AllergyHistoryRecords {

    address public owner;
    uint256 public permissionGrantedCount;
    mapping(address => mapping(address => bool)) isApproved;

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Function to get the owner of the contract; Kung sino yung currently na naka login, kukunin address non
    function getOwner() public view returns (address) {
        return owner;
    }

    // Owner of the record must give permission to a hospital, only then they are allowed to view records
    function givePermission(address _address) public returns (bool success) {
        isApproved[owner][_address] = true;
        permissionGrantedCount++;
        return true;
    }

    // Owner of the record can take away the permission granted to hospital to view records
    function revokePermission(address _address) public returns (bool success) {
        isApproved[owner][_address] = false;
        return true;
    }

    // Function to retrieve all hospitals with permission to view records
    function getAllAuthorizedHospitals() public view returns (address[] memory) {
        address[] memory authorizedHospitals = new address[](permissionGrantedCount);

        uint256 index = 0;
        for (uint256 i = 0; i < patientList.length; i++) {
            address hospitalAddress = patientList[i];
            if (isApproved[owner][hospitalAddress]) {
                authorizedHospitals[index] = hospitalAddress;
                index++;
            }
        }

        return authorizedHospitals;
    }

    // Function to retrieve medical history for a specific patient if meron permission
    function getMedicalHistory(address patientAddr) public view returns (MedicalHistoryRecords.HistoryRecord memory) {
        require(isApproved[owner][msg.sender], "Access Denied."); //checker kung may permission
        return MedicalHistoryRecords.historyRecords[patientAddr];
    }
}
