// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Hospital.sol";

contract AccessControlContract {

    address public hospitalRecordsContractAddress;

    constructor(address _hospitalRecordsContractAddress) {
        hospitalRecordsContractAddress = _hospitalRecordsContractAddress;
    }
    
    // Mapping to store patient permissions
    mapping(string => mapping(address => bool)) public patientPermissions;
    // Mapping to store the relationship between hospitals and patients
    mapping(address => address) public hospitalToPatient;

    modifier onlyPatient(address _patientAddr) {
        require(msg.sender == _patientAddr, "Only patients can call this function");
        _;
    }

    function revokeAccess(string memory _patientID, address _hospitalAddr) public onlyPatient(_hospitalAddr) {
        // Check if the patient has given permission to the specified hospital
        require(patientPermissions[_patientID][_hospitalAddr], "Permission not granted");

        // Revoke access by setting the permission to false
        patientPermissions[_patientID][_hospitalAddr] = false;
    }

    function givePermission(string memory _patientID, address _hospitalAddr) public onlyPatient(_hospitalAddr) {
        // Grant access by setting the permission to true
        patientPermissions[_patientID][_hospitalAddr] = true;
    }

    function getRegisteredHospitals() public view returns (address[] memory) {
        return HospitalRecords(hospitalRecordsContractAddress).getHospitalList();
    }
}
