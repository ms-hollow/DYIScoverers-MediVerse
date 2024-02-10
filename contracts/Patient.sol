// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

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

    // Mapping to associate addresses with structs
    mapping(address => Patient) public patients; 
    //tracks of whether a specific Ethereum address is registered
    mapping(address => bool) public isPatient;
    // Total count of registered patients
    uint256 public patientCount = 0;

    constructor() {
        // owner is already defined in the Records contract
    }

    function registerPatient(string memory _name, string memory _phone, string memory _gender, string memory _age,
    string memory _dateOfBirth, string memory _height, string memory _weight,string memory _houseAddress) public {
        require(!isPatient[msg.sender]);
        Patient memory p = patients[msg.sender];
        
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
    
    /**
    -----PATIENT-----
    getMedicalRecordsList
    getMedicalProcedureList
    getMedicalPrescriptionList
    getLaboratoryHistoryList
    getHospitalizationRecordList
    revokeAccess
    */
}
