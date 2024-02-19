// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PermissionLibrary.sol";
import "./Patient.sol";
import "./Hospital.sol";


//Main Contract
contract Record is PatientRecords, HospitalRecords {

    using PermissionLibrary for mapping(address => mapping(address => bool));

    address public owner;

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
        isApproved.givePermission(owner, _address);
        return true;
    }

    // Owner of the record can take away the permission granted to hospital to view records
    function revokePermission(address _address) public returns (bool success) {
        isApproved.revokePermission(owner, _address);
        return true;
    }

    // Function to retrieve all hospitals with permission to view records
    function getAllAuthorizedHospitals() public view returns (address[] memory) {
        return PermissionLibrary.getAllAuthorizedHospitals(isApproved, owner, patientList);
    }
}
