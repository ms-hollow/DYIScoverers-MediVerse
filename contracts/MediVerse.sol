// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Note kapag ginawa na ang backend. If halo halong characters ang isa-save, dapat may " "
//bago ilagay sa function ng smart contract

contract MediVerse {
    
    struct Patient {
        string name;
        string gender;
        string dateOfBirth;
        string height;
        string weight;
        string contactNum;
        string addr;
        address[] authorizedHospitals;
        uint registrationDate;
    }

    struct Hospital {
        string name;
        string contactNum;
        string addr;
        uint registrationDate;
    }

    struct MedicalHistory {
        address patientAddr;
        address hospitalAddr;
        string physician;
        string diagnosis;
        string signsAndSymptoms;
        string treatmentProcedure;
        string tests;
        string medications;
        string admission;
        uint creationDate;
    }

    struct GeneralHealthProfile {
        address patientAddr;
        address hospitalAddr;
        string physicalExamination;
        string medicalHistorySummary;
        string maintenanceMedication;
        string allergies;
        string medicalProcedureSummary;
        uint creationDate;
    }

    mapping(address => Patient) public patients;
    mapping(address => Hospital) public hospitals;
    mapping(address => MedicalHistory[]) public medicalHistories;
    mapping(address => GeneralHealthProfile[]) public generalHealthProfiles;

    event PatientRegistered(address patientAddr);
    event HospitalRegistered(address hospitalAddr);
    event MedicalHistoryAdded(address patientAddr, address hospitalAddr);
    event GeneralHealthProfileAdded(address patientAddr, address hospitalAddr);
    event PermissionGranted(address patientAddr, address hospitalAddr);
    event PermissionRevoked(address patientAddr, address hospitalAddr);

    modifier onlyPatient() {
        require(bytes(patients[msg.sender].name).length > 0, "Patient not registered");
        _;
    }

    modifier onlyHospital() {
        require(bytes(hospitals[msg.sender].name).length > 0, "Hospital not registered");
        _;
    }

    modifier isAuthorized(address _patientAddr) {
        require(
            isPatientAuthorized(_patientAddr, msg.sender),
            "Hospital not authorized to access patient records"
        );
        _;
    }

    function isPatientAuthorized(address _patientAddr, address _hospitalAddr) internal view returns (bool) {
        for (uint i = 0; i < patients[_patientAddr].authorizedHospitals.length; i++) {
            if (patients[_patientAddr].authorizedHospitals[i] == _hospitalAddr) {
                return true;
            }
        }
        return false;
    }

    function registerPatient(
        string memory _name,
        string memory _contactNum,
        string memory _gender,
        string memory _dateOfBirth,
        string memory _height,
        string memory _weight,
        string memory _address
    ) public {
        require(bytes(patients[msg.sender].name).length == 0, "Patient already registered");

        Patient storage patient = patients[msg.sender];
        patient.name = _name;
        patient.contactNum = _contactNum;
        patient.gender = _gender;
        patient.dateOfBirth = _dateOfBirth;
        patient.height = _height;
        patient.weight = _weight;
        patient.addr = _address;

        patient.registrationDate = block.timestamp;

        emit PatientRegistered(msg.sender);
    }

    function editPatientDetails(
        string memory _name,
        string memory _contactNum,
        string memory _gender,
        string memory _dateOfBirth,
        string memory _height,
        string memory _weight,
        string memory _address
    ) public onlyPatient {
        Patient storage patient = patients[msg.sender];
        patient.name = _name;
        patient.contactNum = _contactNum;
        patient.gender = _gender;
        patient.dateOfBirth = _dateOfBirth;
        patient.height = _height;
        patient.weight = _weight;
        patient.addr = _address;
    }

    function registerHospital(
        string memory _name,
        string memory _contactNum,
        string memory _address
    ) public {
        require(bytes(hospitals[msg.sender].name).length == 0, "Hospital already registered");

        Hospital storage hospital = hospitals[msg.sender];
        hospital.name = _name;
        hospital.contactNum = _contactNum;
        hospital.addr = _address;
        hospital.registrationDate = block.timestamp;

        emit HospitalRegistered(msg.sender);
    }

    function editHospitalDetails(
        string memory _name,
        string memory _contactNum,
        string memory _addr
    ) public onlyHospital {
        Hospital storage hospital = hospitals[msg.sender];
        hospital.name = _name;
        hospital.contactNum = _contactNum;
        hospital.addr = _addr;
    }

    function addMedicalHistory(
        address _patientAddr,
        string memory _physician,
        string memory _diagnosis,
        string memory _signsAndSymptoms,
        string memory _treatmentProcedure,
        string memory _tests,
        string memory _medications,
        string memory _admission
    ) public onlyHospital {
        MedicalHistory memory history;
        history.patientAddr = _patientAddr;
        history.hospitalAddr = msg.sender;
        history.physician = _physician;
        history.diagnosis = _diagnosis;
        history.signsAndSymptoms = _signsAndSymptoms;
        history.treatmentProcedure = _treatmentProcedure;
        history.tests = _tests;
        history.medications = _medications;
        history.admission = _admission;
        history.creationDate = block.timestamp;

        medicalHistories[_patientAddr].push(history);

        emit MedicalHistoryAdded(_patientAddr, msg.sender);
    }

    function addGeneralHealthProfile(
        address _patientAddr,
        string memory _medicalHistorySummary,
        string memory _maintenanceMedication,
        string memory _allergies,
        string memory _medicalProcedureSummary
    ) public onlyHospital {
        GeneralHealthProfile memory profile;
        profile.patientAddr = _patientAddr;
        profile.hospitalAddr = msg.sender;
        profile.medicalHistorySummary = _medicalHistorySummary;
        profile.maintenanceMedication = _maintenanceMedication;
        profile.allergies = _allergies;
        profile.medicalProcedureSummary = _medicalProcedureSummary;
        profile.creationDate = block.timestamp;

        generalHealthProfiles[_patientAddr].push(profile);
        emit GeneralHealthProfileAdded(_patientAddr, msg.sender);
    }

    modifier isHospitalAuthorizedToAccess(address _patientAddr) {
        require(
            isHospitalAuthorized(_patientAddr, msg.sender),
            "Hospital not authorized to access patient records"
        );
        _;
    }

    function isHospitalAuthorized(address _patientAddr, address _hospitalAddr) internal view returns (bool) {
        for (uint i = 0; i < patients[_patientAddr].authorizedHospitals.length; i++) {
            if (patients[_patientAddr].authorizedHospitals[i] == _hospitalAddr) {
                return true;
            }
        }
        return false;
    }

    /** FUNCTION THAT WILL RETRIEVE PATIENTS MEDICAL RECORD AND PROFILE **/
    function getMedicalHistory(address _patientAddr) public view isHospitalAuthorizedToAccess(_patientAddr) returns (MedicalHistory[] memory) {
        return medicalHistories[_patientAddr];
    }

    function getGeneralProfile(address _patientAddr) public view isHospitalAuthorizedToAccess(_patientAddr) returns (GeneralHealthProfile[] memory) {
        return generalHealthProfiles[_patientAddr];
    }

    function givePermission(address _hospitalAddr) public onlyPatient {
        require(!isPatientAuthorized(msg.sender, _hospitalAddr), "Hospital already authorized");

        patients[msg.sender].authorizedHospitals.push(_hospitalAddr);
        emit PermissionGranted(msg.sender, _hospitalAddr);
    }

    function revokePermission(address _hospitalAddr) public onlyPatient {
        require(isPatientAuthorized(msg.sender, _hospitalAddr), "Hospital not authorized");

        address[] storage authorizedHospitals = patients[msg.sender].authorizedHospitals;
        for (uint i = 0; i < authorizedHospitals.length; i++) {
            if (authorizedHospitals[i] == _hospitalAddr) {
                authorizedHospitals[i] = authorizedHospitals[authorizedHospitals.length - 1];
                authorizedHospitals.pop();
                emit PermissionRevoked(msg.sender, _hospitalAddr);
                return;
            }
        }
    }
    /** FUNCTION THAT WILL GET THE LIST OF AUTHORIZED HOSPITALS TO VIEW PATIENTS MEDICAL RECORDS **/
    function getAuthorizedHospitals(address _patientAddr) public view returns (address[] memory) {
        return patients[_patientAddr].authorizedHospitals;
    }

     function getMedicalHistoryCount(address _patientAddr) public view returns (uint256) {
        return medicalHistories[_patientAddr].length;
    }

    function getGeneralProfileCount(address _patientAddr) public view returns (uint256) {
        return medicalHistories[_patientAddr].length;
    }
}
