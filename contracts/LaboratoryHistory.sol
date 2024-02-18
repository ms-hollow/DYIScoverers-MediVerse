// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Hospital.sol";

contract LaboratoryHistoryRecords is HospitalRecords{

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
}   


        