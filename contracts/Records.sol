// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Records {

    enum Gender { Male, Female,Other }
    
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
    }

    struct Hospital {
        string username;
        string password;
        string hospitalName;
        string contactNum;
        string hospitalAddress;
        address addr;
    }

    struct MedicalHistory {
        string hospital;
        string physician;
        uint dateOfDiagnosis;
        string diagnosis;  // Additional Diagnostic Information
 
        // Symptoms
        bool fever;
        bool cough;
        bool shortnessOfBreath;
        bool fatigue;
        bool others;
     
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

    struct MedicalTreatment {
        // General Information
        string treatmentType;
        string hospital;
        uint date;

        // Treatment Details
        string treatmentProvider;
        string specificTreatmentType;
        string treatmentDescription;
        string treatmentFrequency;
        string treatmentDuration;
        string startDateOfTreatment;
        string endDateOfTreatment;
        string responseToTreatment;
        string followUpRecommendations;
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

    // Test Type (Enum for drop-down menu options)
    enum TestCategory { BloodTests, Urinalysis, ImagingStudies, MicrobiologyTests, SerologyTests, HematologyTests,
                        CoagulationStudies, EndocrineTests, GeneticTests, ToxicologyTests, PathologyTests}

    struct LaboratoryHistory {
        // General Information
        string testType;
        string hospital;
        uint dateOfTest;

        // Test Details
        string orderingPhysician;
        string dateOfTestCalendar;

        TestCategory testCategory;
        
        // Specific Tests (uint8 for boolean values)
        // Blood Tests
        uint8 completeBloodCount;
        uint8 basicMetabolicPanel;
        uint8 comprehensiveMetabolicPanel;
        uint8 bloodGlucoseTest;
        uint8 lipidPanel;
        uint8 liverFunctionTests;
        uint8 coagulationPanel;
        uint8 bloodTypingAndCrossmatching;

        // Urinalysis
        uint8 routineUrinalysis;
        uint8 urineCultureAndSensitivity;
        uint8 urineMicroscopicExamination;

        // Imaging Studies
        uint8 xRays;
        uint8 computedTomography;
        uint8 magneticResonanceImaging;
        uint8 ultrasound;
        uint8 positronEmissionTomography;
        uint8 boneScans;

        // Microbiology Tests
        uint8 cultureAndSensitivity;
        uint8 gramStain;
        uint8 acidFastBacilliCulture;
        uint8 fungalCulture;
        uint8 viralCulture;
        uint8 antigenAndAntibodyTests;

        // Serology Tests
        uint8 enzymeLinkedImmunosorbentAssay;
        uint8 rapidPlasmaReaginTest;
        uint8 treponemalAntibodyTests;
        uint8 rheumatoidFactor;
        uint8 cReactiveProtein;

        // Hematology Tests
        uint8 hemoglobinA1c;
        uint8 hemoglobinElectrophoresis;
        uint8 bloodSmearExamination;
        uint8 erythrocyteSedimentationRate;
        uint8 peripheralBloodFilm;

        // Coagulation Studies
        uint8 prothrombinTime;
        uint8 internationalNormalizedRatio;
        uint8 partialThromboplastinTime;
        uint8 dDimerTest;
        uint8 plateletCount;

        // Endocrine Tests
        uint8 thyroidFunctionTests;
        uint8 adrenalFunctionTests;
        uint8 insulinLevels;
        uint8 testosteroneLevels;
        uint8 follicleStimulatingHormoneLevels;

        // Genetic Tests
        uint8 polymeraseChainReaction;
        uint8 fluorescenceInSituHybridization;
        uint8 chromosomalAnalysis;
        uint8 geneticScreeningAndCounseling;

        // Toxicology Tests
        uint8 drugScreening;
        uint8 alcoholLevels;
        uint8 heavyMetalTesting;

        // Pathology Tests
        uint8 tissueBiopsy;
        uint8 fineNeedleAspiration;
        uint8 papSmear;
        uint8 histopathology;
        uint8 immunohistochemistry;

        // Results (Upload file/IPFS hash)
        string resultsIpfsHash;

        // Additional Details
        string reviewingPhysician;
        string interpretation;
        string preTestInstructions;
        string followUpActions;
    }

    // Struct for Hospitalization History
    struct HospitalizationRecord {
        // Patient Information
        string patientName;
        string patientID;
        string dateOfBirth;
        string gender;
        address addr;
        string phoneNumber;

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
        string hospitalUnit;
        string roomNumber;
        string bedNumber;
    }
     // Enum for Allergy Types
    enum AllergyType { Drug, Food, Environmental, InsectSting }
    
    // Enum for Allergy Severity
    enum Severity { Mild, Moderate, Severe }

    // Struct for Allergy
    struct AllergyRecord {
        // Allergy Details
        string allergen;
        AllergyType allergyType;
        Severity severity;
        string reaction;
        string dateStarted;
        string lastReactionDate;

        // Allergy Testing
        string allergyTestType;
        string testResults;

        // Treatment and Management
        string medications;
        string avoidanceStrategies;
        string followUpPlan;
        string additionalNotes;
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

    function registerPatient(
        string memory _username,
        string memory _password,
        string memory _name,
        string memory _phone,
        string memory _gender,
        string memory _dateOfBirth,
        string memory _height,
        string memory _weight,
        string memory _houseAddress,
        address _addr
    ) public {
        require(!isPatient[_addr]);
        Patient storage p = patients[_addr];
        
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

        patientList.push(msg.sender);
        isPatient[msg.sender] = true;
        patientCount++;
    }

    function registerHospital(
        string memory _username,
        string memory _password,
        string memory _hospitalName,
        string memory _contactNum,
        string memory _hospitalAddress,
        address _addr
    ) public {
        require(!isHospital[_addr]);
        Hospital storage h = hospitals[_addr];
        
       h.username = _username;
       h.password = _password;
       h.hospitalName = _hospitalName;
       h.contactNum = _contactNum;
       h.hospitalAddress = _hospitalAddress;

        hospitalList.push(msg.sender);
        isHospital[msg.sender] = true;
        hospitalCount++;
    }

    /**
    getPatientInfo (reretrieve account niya sa blockchain)
    createNewMedicalRecord
    getPatientList
    getMedicalRecordsList
    getMedicalProcedureList
    getMedicalTreatmentList
    getMedicalPrescriptionList
    getLaboratoryHistoryList
    getHospitalizationRecordList
    getAllergyList
    getHospitalList
    */
    
}
