// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {

    struct Patient {
        string name;
        string phone;
        string gender;
        string age;
        string dateOfBirth;
        string height;
        string weight;
        string houseAddress;
        address addr;
        uint date;
    }

    address[] public patientList; // Dynamic array to store the addresses of registered patients
    mapping(address => Patient) public patients; // Mapping to associate addresses with structs
    mapping(address => bool) public isPatient; // Tracks whether a specific Ethereum address is registered
    uint256 public patientCount = 0;

    function registerPatient(
        string memory _name,
        string memory _phone,
        string memory _gender,
        string memory _age,
        string memory _dateOfBirth,
        string memory _height,
        string memory _weight,
        string memory _houseAddress
    ) public {
        
        require(!isPatient[msg.sender], "Patient already registered");

        Patient storage p = patients[msg.sender];  
        
        p.name = _name;
        p.phone = _phone;
        p.age = _age;
        p.gender = _gender;
        p.dateOfBirth = _dateOfBirth;
        p.height = _height;
        p.weight = _weight;
        p.houseAddress = _houseAddress;
        p.addr = msg.sender;
        p.date = block.timestamp;

        patientList.push(msg.sender);
        isPatient[msg.sender] = true;
        patientCount++;
    }

    function editPatientProfile(
        string memory _name,
        string memory _phone,
        string memory _dateOfBirth,
        string memory _height,
        string memory _weight,
        string memory _houseAddress
    ) public {
        require(isPatient[msg.sender]);
        Patient storage p = patients[msg.sender];
        
        p.name = _name;
        p.phone = _phone;
        p.dateOfBirth = _dateOfBirth;
        p.height = _height;
        p.weight = _weight;
        p.houseAddress = _houseAddress;
    }
}