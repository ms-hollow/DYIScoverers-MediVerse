// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Records {

    struct Patient {
        string username;
        string password;
        string name;
        string phone;
        string gender;
        string dateOfBirth;
        string height;
        string weight;
        string houseAddress;
        address addr;
        uint date;

        //Arrays na mags-store ng records
        MedicalHistory[] medicalHistories;
        MedicalProcedure[] medicalProcedures;
        MedicationPrescription[] medicationPrescriptions;
        LaboratoryHistory[] laboratoryHistories;
        HospitalizationRecord[] hospitalizationRecords;
    }

    struct Hospital {
        string username;
        string password;
        string hospitalName;
        string contactNum;
        string hospitalAddress;
        address addr;
        uint date;
    }

    struct MedicalHistory {
        string hospital;
        string physician;
        uint dateOfDiagnosis;
        string diagnosis;  // Additional Diagnostic Information
        string symptoms;    
        string durationOfSymptoms; // Duration and Severity
        string severityOfSymptoms;
        string signs; // Signs
        string diagnosticTests; // Diagnostic Tests
        string relevantMedicalHistory; // Relevant Medical History
        string geneticHistory; // Genetic History
    }

    struct MedicalProcedure {
        // General Information
        string procedureType;
        string hospital;
        uint date;
        // Procedure Details
        string medicalTeam;
        string procedureDescription;
        string procedureComplications;
        string dateOfProcedure;
        string durationOfProcedure;
        string anesthesiaUsed;
        string anesthesiaDosage;
        string preOperativeInstructions;     
        // Post-operative Care
        string postOperativeCare;
    }

    struct MedicationPrescription {
        // General Information
        string medication;
        string hospital;
        uint dateOfPrescription;
        // Prescription Details
        string prescribingPhysician;
        string dateOfPrescriptionCalendar;
        string purpose;
        string dosage;
        string route;
        string frequency;
        string duration;
        string startDate;
        string endDate;
        string adverseReactionsSideEffects;
    }

    struct LaboratoryHistory {
        // General Information
        string testType; //kung ano type ng test (blood test, urinalysis, etc)
        string hospital;
        uint dateOfTest;
        // Test Details
        string orderingPhysician;
        string dateOfTestCalendar;
        string testCategory; //kung ano category niya (ex. CBC, CTS, etc)
        string resultsIpfsHash;  // Results (Upload file/IPFS hash)
        // Additional Details
        string reviewingPhysician;
        string interpretation;
        string preTestInstructions;
        string followUpActions;
    }

    // Struct for Hospitalization History
    struct HospitalizationRecord {
        // Hospitalization Details
        string admissionDate;
        string dischargeDate;
        string reasonForHospitalization;
        string admittingDiagnosis;
        string dischargeDiagnosis;
        string lengthOfStay;
        // Hospital Information
        string hospitalName;
        string physicians;
    }

    address public owner; // Address of the owner of the contract
    address[] public patientList; // Dynamic array to store the addresses of registered patients
    address[] public hospitalList;

    // Mapping to associate patient addresses with Patient/Hospital structs
    mapping(address => Patient) public patients; 
    mapping(address => Hospital) public hospitals;

    //tracks of whether a specific Ethereum address is registered
    mapping(address => bool) public isPatient;
    mapping(address => bool) public isHospital;
    
    // Total count of registered patients
    uint256 public patientCount = 0;
    uint256 public hospitalCount = 0;

    constructor() {
        owner = msg.sender;
    }

    function registerPatient(string memory _username, string memory _password, string memory _name, string memory _phone, string memory _gender, 
    string memory _dateOfBirth, string memory _height, string memory _weight,string memory _houseAddress) public {
        require(!isPatient[msg.sender]);
        Patient memory p = patients[msg.sender];
        
        p.username = _username;
        p.password = _password;
        p.name = _name;
        p.phone = _phone;
        p.gender = _gender;
        p.dateOfBirth = _dateOfBirth;
        p.height = _height;
        p.weight = _weight;
        p.houseAddress = _houseAddress;
        p.addr = msg.sender;
        p.date = block.timestamp;

        // Initialize the medicalRecords array 
        p.medicalHistories = new MedicalHistory[](0);
        patientList.push(msg.sender);
        isPatient[msg.sender] = true;
        patientCount++;
    }

    function registerHospital(string memory _username, string memory _password, string memory _hospitalName, string memory _contactNum, string memory _hospitalAddress) public {
        require(!isHospital[msg.sender]);
        Hospital memory h = hospitals[msg.sender];
        
        h.username = _username;
        h.password = _password;
        h.hospitalName = _hospitalName;
        h.contactNum = _contactNum;
        h.hospitalAddress = _hospitalAddress;
        h.addr = msg.sender;
        h.date = block.timestamp;

        hospitalList.push(msg.sender);
        isHospital[msg.sender] = true;
        hospitalCount++;
    }

    //Retrieve a list of all patients address
    function getPatients() public view returns(address[] memory) {
        return patientList;
    }

    //Retrieve a list of all doctors address
    function getHospitals() public view returns(address[] memory) {
        return hospitalList;
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

    function editHospitalProfile(string memory _hospitalName, string memory _contactNum, string memory _hospitalAddress) public {
        require(isHospital[msg.sender]);
        Hospital storage h = hospitals[msg.sender];
        
        h.hospitalName = _hospitalName;
        h.contactNum = _contactNum;
        h.hospitalAddress = _hospitalAddress;
    }

    
    /**
    Note: Size of the contract code exceeds the limit of 24,576 bytes
    -----HOSPITAL-----
    addNewPatientMedicalHistory
    addNewPatientMedicalProcedure
    addNewPatientMedicalPrescription
    addNewPatientLaboratoryRecord
    addNewPatientHospitalizationRecord
    editPatientRecord

    -----PATIENT-----
    getMedicalRecordsList
    getMedicalProcedureList
    getMedicalPrescriptionList
    getLaboratoryHistoryList
    getHospitalizationRecordList
    revokeAccess
    */
}
