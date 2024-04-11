// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//? Changes: Modified request permission

contract MediVerse {
    
    struct Patient {
        string name;
        string age;
        string gender;
        string dateOfBirth;
        string height;
        string weight;
        string contactNum;
        string addr;
        address[] authorizedHospitals;
        uint creationDate;
    }

    struct Hospital {
        string name;
        string contactNum;
        string addr;
        uint creationDate;
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

    address[] public patientList; 
    address[] public hospitalList;
    MedicalHistory[] public medicalHistoryList;
    mapping(address => bool) public isRegistered;
    mapping(address => Patient) public patients;
    mapping(address => Hospital) public hospitals;
    mapping(address => MedicalHistory[]) public medicalHistories;
    mapping(address => address[]) private pendingRequests;

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
        string memory _age,
        string memory _gender,
        string memory _dateOfBirth,
        string memory _height,
        string memory _weight,
        string memory _contactNum,
        string memory _address
    ) public {
        require(!isRegistered[msg.sender], "Patient already registered");

        Patient storage patient = patients[msg.sender];
        patient.name = _name;
        patient.age = _age;
        patient.gender = _gender;
        patient.dateOfBirth = _dateOfBirth;
        patient.height = _height;
        patient.weight = _weight;
        patient.contactNum = _contactNum;
        patient.addr = _address;

        patient.creationDate = block.timestamp;
        patientList.push(msg.sender);
        isRegistered[msg.sender] = true;
    }

    function editPatientDetails(
        string memory _name,
        string memory _age,
        string memory _gender,
        string memory _dateOfBirth,
        string memory _height,
        string memory _weight,
        string memory _contactNum,
        string memory _address
    ) public {
        Patient storage patient = patients[msg.sender];
        patient.name = _name;
        patient.age = _age;
        patient.gender = _gender;
        patient.dateOfBirth = _dateOfBirth;
        patient.height = _height;
        patient.weight = _weight;
        patient.contactNum = _contactNum;
        patient.addr = _address;
        patient.creationDate = block.timestamp;
    }

    function registerHospital(
        string memory _name,
        string memory _contactNum,
        string memory _address
    ) public {
        require(!isRegistered[msg.sender], "Hospital already registered");
        Hospital storage hospital = hospitals[msg.sender];
        hospital.name = _name;
        hospital.contactNum = _contactNum;
        hospital.addr = _address;
        hospital.creationDate = block.timestamp;

        hospitalList.push(msg.sender);
        isRegistered[msg.sender] = true;
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
        hospital.creationDate = block.timestamp;
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

        require(isRegistered[_patientAddr], "Patient not registered");

        if (!isHospitalAuthorized(_patientAddr, msg.sender)) {
            patients[_patientAddr].authorizedHospitals.push(msg.sender);
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

    function getMedicalHistory(address _patientAddr) public view returns (MedicalHistory[] memory) {
        if (msg.sender == _patientAddr) {
            return medicalHistories[_patientAddr];
        } else {
            require(isHospitalAuthorized(_patientAddr, msg.sender), "Caller is not authorized to access patient records");
            return medicalHistories[_patientAddr];
        }
    }

    // function that will retrieve all the list of medical record
    function getAllMedicalHistory() public view returns (MedicalHistory[] memory) {
        return medicalHistoryList;
    }

    // Function to retrieve patient information
    function getPatientInfo(address patientAddress) external view returns (string memory, string memory, string memory, string memory, string memory, string memory, string memory, string memory, address[] memory, uint) {
        Patient storage patient = patients[patientAddress];
        return (patient.name, patient.age, patient.gender, patient.dateOfBirth, patient.height, patient.weight, patient.contactNum, patient.addr, patient.authorizedHospitals, patient.creationDate);
    }

    // Function to retrieve hospital information
    function getHospitalInfo(address hospitalAddress) external view returns (string memory, string memory, string memory, uint) {
        Hospital storage hospital = hospitals[hospitalAddress];
        return (hospital.name, hospital.contactNum, hospital.addr, hospital.creationDate);
    }
    
    function givePermission(address _hospitalAddr) public  {
        require(!isHospitalAuthorized(msg.sender, _hospitalAddr), "Hospital already authorized");
        address[] storage pending = pendingRequests[msg.sender];
        for (uint i = 0; i < pending.length; i++) {
            if (pending[i] == _hospitalAddr) {
                pending[i] = pending[pending.length - 1];
                pending.pop();
                break;
            }
        }
        patients[msg.sender].authorizedHospitals.push(_hospitalAddr);
    }

    function revokeAccess(address _hospitalAddr) public {
        require(isHospitalAuthorized(msg.sender, _hospitalAddr), "Hospital not authorized");
        address[] storage authorizedHospitals = patients[msg.sender].authorizedHospitals;
        for (uint i = 0; i < authorizedHospitals.length; i++) {
            if (authorizedHospitals[i] == _hospitalAddr) {
                authorizedHospitals[i] = authorizedHospitals[authorizedHospitals.length - 1];
                authorizedHospitals.pop();
                return;
            }
        }
    }
    
    // Function that will request access for patients medical record
    function requestPermission(address _patientAddr) public {
        require(!isHospitalAuthorized(_patientAddr, msg.sender), "Request already sent");
        pendingRequests[_patientAddr].push(msg.sender);
    }

    function getAuthorizedHospitals(address _patientAddr) public view returns (address[] memory) {
        return patients[_patientAddr].authorizedHospitals;
    }

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