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

    address[] public patientList; // Dynamic array to store the addresses of registered patients
    address[] public hospitalList;
    MedicalHistory[] public medicalHistoryList;
    mapping(address => bool) public isRegistered;
    mapping(address => Patient) public patients;
    mapping(address => Hospital) public hospitals;
    mapping(address => MedicalHistory[]) public medicalHistories;
    mapping(address => address[]) public pendingRequests;

    event PatientRegistered(address patientAddr);
    event HospitalRegistered(address hospitalAddr);
    event MedicalHistoryAdded(address patientAddr, address hospitalAddr);
    event GeneralHealthProfileAdded(address patientAddr, address hospitalAddr);
    event PermissionGranted(address patientAddr, address hospitalAddr);
    event PermissionRevoked(address patientAddr, address hospitalAddr);

    modifier isRegister() {
        require(isRegistered[msg.sender], "Account is not registered");
        _;
    }

    modifier isAuthorized(address _patientAddr) {
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

    function registerPatient(
        string memory _name,
        string memory _contactNum,
        string memory _gender,
        string memory _dateOfBirth,
        string memory _height,
        string memory _weight,
        string memory _address
    ) public {
        require(!isRegistered[msg.sender], "Patient already registered");

        Patient storage patient = patients[msg.sender];
        patient.name = _name;
        patient.contactNum = _contactNum;
        patient.gender = _gender;
        patient.dateOfBirth = _dateOfBirth;
        patient.height = _height;
        patient.weight = _weight;
        patient.addr = _address;

        patient.registrationDate = block.timestamp;
        patientList.push(msg.sender);
        isRegistered[msg.sender] = true;
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
    ) public {
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
        require(!isRegistered[msg.sender], "Patient already registered");
        Hospital storage hospital = hospitals[msg.sender];
        hospital.name = _name;
        hospital.contactNum = _contactNum;
        hospital.addr = _address;
        hospital.registrationDate = block.timestamp;

        hospitalList.push(msg.sender);
        emit HospitalRegistered(msg.sender);
    }

    function editHospitalDetails(
        string memory _name,
        string memory _contactNum,
        string memory _addr
    ) public {
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
    ) public {
        // Check if the patient is registered
        require(isRegistered[_patientAddr], "Patient not registered");

        // Check if the hospital is authorized, if not, grant access
        if (!isHospitalAuthorized(_patientAddr, msg.sender)) {
            patients[_patientAddr].authorizedHospitals.push(msg.sender);
            emit PermissionGranted(_patientAddr, msg.sender);
        }

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
        medicalHistoryList.push(history);
        emit MedicalHistoryAdded(_patientAddr, msg.sender);
    }

    function editMedicalHistory(
        address _patientAddr,
        string memory _physician,
        string memory _diagnosis,
        string memory _signsAndSymptoms,
        string memory _treatmentProcedure,
        string memory _tests,
        string memory _medications,
        string memory _admission
    ) public {
        MedicalHistory[] storage history = medicalHistories[_patientAddr];

        // Check if there are any records for the specified patient
        require(history.length > 0, "No medical history records found for the patient");

        // Iterate through the records to find the one matching your criteria
        for (uint i = 0; i < history.length; i++) {
            if (history[i].hospitalAddr == msg.sender) {
                // Update the record with the new information
                history[i].physician = _physician;
                history[i].diagnosis = _diagnosis;
                history[i].signsAndSymptoms = _signsAndSymptoms;
                history[i].treatmentProcedure = _treatmentProcedure;
                history[i].tests = _tests;
                history[i].medications = _medications;
                history[i].admission = _admission;

                return; // Exit the function after updating the record
            }
        }
        // If no matching record is found, revert the transaction
        revert("Medical history record not found for the specified hospital");
    }

    // Function that retrieves medical records for a specific patient
    function getMedicalHistory(address _patientAddr) public view returns (MedicalHistory[] memory) {
        // Check if the caller is the patient themselves
        if (msg.sender == _patientAddr) {
            // Return medical records for the patient
            return medicalHistories[_patientAddr];
        } else {
            // Check if the caller is authorized to access the patient's medical history
            require(isHospitalAuthorized(_patientAddr, msg.sender), "Caller is not authorized to access patient records");
            // Return medical records for the patient
            return medicalHistories[_patientAddr];
        }
    }

    // function that will retrieve all the list of medical record
    function getAllMedicalHistory() public view returns (MedicalHistory[] memory) {
        return medicalHistoryList;
    }

    // Function to retrieve patient information
    function getPatientInfo(address patientAddress) external view returns (string memory, string memory, string memory, string memory, string memory, string memory, string memory, address[] memory, uint) {
        Patient storage patient = patients[patientAddress];
        return (patient.name, patient.gender, patient.dateOfBirth, patient.height, patient.weight, patient.contactNum, patient.addr, patient.authorizedHospitals, patient.registrationDate);
    }

    // Function to retrieve hospital information
    function getHospitalInfo(address hospitalAddress) external view returns (string memory, string memory, string memory, uint) {
        Hospital storage hospital = hospitals[hospitalAddress];
        return (hospital.name, hospital.contactNum, hospital.addr, hospital.registrationDate);
    }
    
    function givePermission(address _hospitalAddr) public  {
        require(!isHospitalAuthorized(msg.sender, _hospitalAddr), "Hospital already authorized");

        // Check if the hospital is already in the pending requests
        bool isPending = false;
        for (uint i = 0; i < pendingRequests[msg.sender].length; i++) {
            if (pendingRequests[msg.sender][i] == _hospitalAddr) {
                isPending = true;
                break;
            }
        }
        // If not in pending, add to both authorized and pending requests
        if (!isPending) {
            patients[msg.sender].authorizedHospitals.push(_hospitalAddr);
            pendingRequests[msg.sender].push(_hospitalAddr);
        }

        emit PermissionGranted(msg.sender, _hospitalAddr);
    }

    function revokeAccess(address _hospitalAddr) public {
        require(isHospitalAuthorized(msg.sender, _hospitalAddr), "Hospital not authorized");

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

    // Function to get the list of pending permission requests for a patient
    function getPendingRequests(address _patientAddr) public view returns (address[] memory) {
        return pendingRequests[_patientAddr];
    }

    function getPatientList() public view returns (address[] memory) {
        return patientList;
    }

    function getHospitalList() public view returns (address[] memory) {
        return hospitalList;
    }

    function searchByName(string memory query) public view returns (address[] memory) {
        address[] memory searchResults = new address[](patientList.length + hospitalList.length);

        uint resultIndex = 0;

        // Search among patients by name
        for (uint i = 0; i < patientList.length; i++) {
            address patientAddr = patientList[i];
            if (compareStringsIgnoreCase(patients[patientAddr].name, query)) {
                searchResults[resultIndex] = patientAddr;
                resultIndex++;
            }
        }

        // Search among hospitals by name
        for (uint j = 0; j < hospitalList.length; j++) {
            if (compareStringsIgnoreCase(hospitals[hospitalList[j]].name, query)) {
                searchResults[resultIndex] = hospitalList[j];
                resultIndex++;
            }
        }

        // Resize the array to remove any unused slots
        assembly {
            mstore(searchResults, resultIndex)
        }

        return searchResults;
    }

    function compareStringsIgnoreCase(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}