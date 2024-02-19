// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Hospital.sol";
import "./PermissionLibrary.sol";

contract LaboratoryHistoryRecords is HospitalRecords {

    using PermissionLibrary for mapping(address => mapping(address => bool));
    mapping(address => mapping(address => bool)) isApprovedToViewLaboratoryHistory;

    struct LaboratoryRecord {
        address owner; //Patient's address
        address hospitalAddr;
        string hospital;
        string testType; //kung ano type ng test (blood test, urinalysis, etc)
        string dateOfTest;
        string orderingPhysician;
        string testCategory; //kung ano category niya (ex. CBC, CTS, etc)
        string resultsIpfsHash;  // Results (Upload file/IPFS hash)
        string reviewingPhysician;
        string interpretation;
    }

    address[] public laboratoryList;
    mapping(address => LaboratoryRecord) public laboratoryRecords;
    mapping(address => address[]) public patientLaboratoryRecords;
    uint256 public laboratoryHistoryCount = 0;

    function addLaboratoryHistory(
        address _patientAddr,
        string memory _hospital,
        string memory _testType,
        string memory _dateOfTest,
        string memory _orderingPhysician,
        string memory _testCategory,
        string memory _resultsIpfsHash,
        string memory _reviewingPhysician,
        string memory _interpretation
    ) public{
        require(isHospital[msg.sender]);

        LaboratoryRecord storage record = laboratoryRecords[_patientAddr];

        record.hospitalAddr = msg.sender;
        record.owner = _patientAddr;
        record.hospital = _hospital;
        record.testType = _testType;
        record.dateOfTest = _dateOfTest;
        record.orderingPhysician = _orderingPhysician;
        record.testCategory = _testCategory;
        record.resultsIpfsHash =  _resultsIpfsHash;
        record.reviewingPhysician = _reviewingPhysician;
        record.interpretation = _interpretation;

        patientLaboratoryRecords[_patientAddr].push(msg.sender);
        laboratoryHistoryCount++;
    }

    function editLaboratoryHistory(
        address _patientAddr,
        string memory _hospital,
        string memory _testType,
        string memory _dateOfTest,
        string memory _orderingPhysician,
        string memory _testCategory,
        string memory _resultsIpfsHash,
        string memory _reviewingPhysician,
        string memory _interpretation
    ) public {
        require(isHospital[msg.sender]);

        LaboratoryRecord storage record = laboratoryRecords[_patientAddr];

         // Check if the record exists and belongs to the specified patient
        require(record.hospitalAddr != address(0), "Record does not exist");

        record.hospitalAddr = msg.sender;
        record.owner = _patientAddr;
        record.hospital = _hospital;
        record.testType = _testType;
        record.dateOfTest = _dateOfTest;
        record.orderingPhysician = _orderingPhysician;
        record.testCategory = _testCategory;
        record.resultsIpfsHash =  _resultsIpfsHash;
        record.reviewingPhysician = _reviewingPhysician;
        record.interpretation = _interpretation;
    }

    // Function to retrieve medical history for a specific patient if meron permission
    function getLaboratoryHistory(address patientAddr) public view returns (LaboratoryHistoryRecords.LaboratoryRecord memory) {
        require(isApprovedToViewLaboratoryHistory[patientAddr][msg.sender], "Access Denied."); //checker kung may permission
        return LaboratoryHistoryRecords.laboratoryRecords[patientAddr];
    }
}   


        