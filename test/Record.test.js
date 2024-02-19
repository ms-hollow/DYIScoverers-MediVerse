const Record = artifacts.require("Record");
const MedicalHistoryRecords = artifacts.require("MedicalHistoryRecords");
const LaboratoryHistoryRecords = artifacts.require("LaboratoryHistoryRecords");
const HospitalRecords = artifacts.require("HospitalRecords");

contract("Record", (accounts) => {
    
    let recordInstance;
    let medicalHistoryInstance;
    let laboratoryHistoryInstance;
    let hospitalRecordsInstance;
    const patient = accounts[0];
    //const hospital = accounts[1];

    before(async () => {
        recordInstance = await Record.deployed();
        medicalHistoryInstance = await MedicalHistoryRecords.deployed();
        laboratoryHistoryInstance = await LaboratoryHistoryRecords.deployed();
        hospitalRecordsInstance = await HospitalRecords.deployed();
    });

    it('can register a hospital', async () => {
        await hospitalRecordsInstance.registerHospital(
            'East Avenue Medical Center',
            '29280611',
            'East Ave, Diliman, Quezon City, 1100 Metro Manila',
            { from: accounts[1] } // assuming accounts[1] is a different address
        );
        
        const hospital = await hospitalRecordsInstance.hospitals(accounts[1]);

        assert.equal(hospital.hospitalName, 'East Avenue Medical Center');
        assert.equal(hospital.contactNum, '29280611');
        assert.equal(hospital.hospitalAddress, 'East Ave, Diliman, Quezon City, 1100 Metro Manila');
    });
  
    it("should deploy contracts with the correct owner", async () => {
        const ownerAddress = await recordInstance.getOwner();
        assert.equal(ownerAddress, patient, "Owner not set correctly");
    });

    it('should retrieve authorized hospitals', async () => {
        const authorizedHospitals = await recordInstance.getAllAuthorizedHospitals();
        assert.equal(authorizedHospitals.length, 0, "There should be no authorized hospitals");
    });
  
    it("should give permission to a hospital", async () => {
        try {
            const success = await recordInstance.givePermission(accounts[1], { from: patient });
            assert.equal(success, true, "Permission granted");
        } catch (error) {
            console.error("Revert Reason:", error.reason);
        }
    });

    it("should add medical history record", async () => {    
        // Check if the hospital is registered
        const isHospitalRegistered = await recordInstance.isHospital(accounts[1]);
        assert.equal(isHospitalRegistered, true, "Hospital is not registered");

        // Add medical history record
        await medicalHistoryInstance.addMedicalHistory(
            patient,
            'City General Hospital',
            '2022-01-01',
            'Some Diagnosis',
            'Fever, cough',
            'Acute',
            'High temperature, persistent cough',
            'None',
            { from: accounts[1] }
        );

        // Retrieve the added medical history record
        const addedRecord = await medicalHistoryInstance.getMedicalHistory(patient, { from: accounts[1] });

        // Check the details of the added record
        assert.equal(addedRecord.hospital, 'City General Hospital', 'Incorrect hospital');
        assert.equal(addedRecord.dateOfDiagnosis, '2022-01-01', 'Incorrect date of diagnosis');
        assert.equal(addedRecord.diagnosis, 'Some Diagnosis', 'Incorrect diagnosis');
        assert.equal(addedRecord.symptoms, 'Fever, cough', 'Incorrect symptoms');
        assert.equal(addedRecord.durationSeverity, 'Acute', 'Incorrect duration/severity');
        assert.equal(addedRecord.signs, 'High temperature, persistent cough', 'Incorrect signs');
        assert.equal(addedRecord.relevantMedicalHistory, 'None', 'Incorrect relevant medical history');
    });

    it("should edit medical history record", async () => {
        // Check if the hospital is registered
        const isHospitalRegistered = await recordInstance.isHospitalRegistered(accounts[1]);
        assert.equal(isHospitalRegistered, true, "Hospital is not registered");

        // Edit medical history record
        await medicalHistoryInstance.editMedicalHistory(
            patient,
            'City Hospital',
            '2022-02-01',
            'New Diagnosis',
            'Headache, fatigue',
            'Chronic',
            'Frequent headaches, fatigue',
            'Family history of migraines',
            { from: hospital }
        );

        // Retrieve the edited medical history record
        const editedRecord = await medicalHistoryInstance.getMedicalHistory(patient, { from: accounts[1] });

        // Check the details of the edited record
        assert.equal(editedRecord.hospital, 'City Hospital', 'Incorrect hospital');
        assert.equal(editedRecord.dateOfDiagnosis, '2022-02-01', 'Incorrect date of diagnosis');
        assert.equal(editedRecord.diagnosis, 'New Diagnosis', 'Incorrect diagnosis');
        assert.equal(editedRecord.symptoms, 'Headache, fatigue', 'Incorrect symptoms');
        assert.equal(editedRecord.durationSeverity, 'Chronic', 'Incorrect duration/severity');
        assert.equal(editedRecord.signs, 'Frequent headaches, fatigue', 'Incorrect signs');
        assert.equal(editedRecord.relevantMedicalHistory, 'Family history of migraines', 'Incorrect relevant medical history');
    });
    
    it("should revoke permission to a hospital", async () => {
        try {
            const success = await recordInstance.revokePermission(accounts[1], { from: patient });
            assert.equal(success, true, "Permission revoked");
        } catch (error) {
            console.error("Revert Reason:", error.reason);
        }
    });
});