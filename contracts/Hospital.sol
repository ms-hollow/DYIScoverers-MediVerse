// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HospitalRecords {

    event HospitalRegistered(string hospitalName, string contactNum, string hospitalAddress);

   struct Hospital {
        string hospitalName;
        string contactNum;
        string hospitalAddress;
        address addr;
        uint date;
    }

    address public owner; 
    address[] public hospitalList;
    mapping(address => Hospital) public hospitals; // Mapping to associate addresses with structs
    mapping(address => bool) public isHospital; //tracks of whether a specific Ethereum address is registered
    uint256 public hospitalCount = 0; // Total count of registered hospital
    
    constructor() {
        owner = msg.sender;
    }

    function registerHospital(string memory _hospitalName, string memory _contactNum, string memory _hospitalAddress) public {
        require(!isHospital[msg.sender]);
        
        Hospital memory h = hospitals[msg.sender];
        h.hospitalName = _hospitalName;
        h.contactNum = _contactNum;
        h.hospitalAddress = _hospitalAddress;
        h.addr = msg.sender;
        h.date = block.timestamp;

        hospitalList.push(msg.sender);
        isHospital[msg.sender] = true;
        hospitalCount++;
        emit HospitalRegistered(_hospitalName, _contactNum, _hospitalAddress);
    }

    function editHospitalProfile(string memory _hospitalName, string memory _contactNum, string memory _hospitalAddress) public {
        require(isHospital[msg.sender]);
        Hospital storage h = hospitals[msg.sender];
        
        h.hospitalName = _hospitalName;
        h.contactNum = _contactNum;
        h.hospitalAddress = _hospitalAddress;
    }

    function getHospitalList() public view returns (address[] memory) {
        return hospitalList;
    }
}
