const MedicalHistoryRecords = artifacts.require("MedicalHistoryRecords");
const HospitalRecords = artifacts.require("HospitalRecords");
const PatientRecords = artifacts.require("PatientRecords");

contract("MedicalHistoryRecords", (accounts) => {
    let medicalHistoryRecords;
    let hospitalRecords;
    let patientRecords;

    beforeEach(async () => {
        hospitalRecords = await HospitalRecords.new();
        patientRecords = await PatientRecords.new();
        medicalHistoryRecords = await MedicalHistoryRecords.new();

        // Register a hospital
        await hospitalRecords.registerHospital("Hospital 1", "1234567890", "123 Hospital St", { from: accounts[0] });

        // Register a patient
        await patientRecords.registerPatient(
            'P123',
            'John Doe',
            '1234567890',
            'Male',
            '30',
            '01/01/1992',
            '180',
            '70',
            '123 Main St',
            { from: accounts[1] }
        );
    });

    it('should deploy a contract', async () => {
        assert.ok(medicalHistoryRecords.address);
    });

    it('can add and retrieve medical history record', async () => {
        const recordID = 'R123';
        const physician = 'Dr. Smith';
        const dateOfDiagnosis = 1677646743;
        const diagnosis = 'Common Cold';
        const symptoms = 'Cough, Sneezing';
        const durationSeverity = '2 weeks, Mild';
        const signs = 'Fever, Runny nose';
        const relevantMedicalHistory = 'None';

        // Add a medical history record
        await medicalHistoryRecords.addMedicalHistory(
            'P123',
            recordID,
            physician,
            dateOfDiagnosis,
            diagnosis,
            symptoms,
            durationSeverity,
            signs,
            relevantMedicalHistory,
            { from: accounts[0] }
        );

        // Retrieve medical history records for the patient
        const records = await medicalHistoryRecords.getMedicalHistoryRecords('P123');

        // Assertions for the retrieved records
        assert.equal(records.length, 1, "Number of records should be 1");
        assert.equal(records[0], recordID, "Record ID should match");
    });

    it('can edit medical history record', async () => {
        const recordID = 'R123';
        const initialPhysician = 'Dr. Smith';
        const initialDateOfDiagnosis = 1677646743;

        // Add a medical history record
        await medicalHistoryRecords.addMedicalHistory(
            'P123',
            recordID,
            initialPhysician,
            initialDateOfDiagnosis,
            'Common Cold',
            'Cough, Sneezing',
            '2 weeks, Mild',
            'Fever, Runny nose',
            'None',
            { from: accounts[0] }
        );

        // Update details for the medical history record
        const updatedPhysician = 'Dr. Johnson';
        const updatedDateOfDiagnosis = 1677856743;

        // Edit the medical history record
        await medicalHistoryRecords.editMedicalHistory(
            recordID,
            updatedPhysician,
            updatedDateOfDiagnosis,
            'Updated Diagnosis',
            'Updated Symptoms',
            'Updated Duration Severity',
            'Updated Signs',
            'Updated Relevant Medical History',
            { from: accounts[0] }
        );

        // Retrieve the edited record
        const updatedRecord = await medicalHistoryRecords.historyRecords(recordID);

        // Assertions for the edited record
        assert.equal(updatedRecord.physician, updatedPhysician);
        assert.equal(updatedRecord.dateOfDiagnosis, updatedDateOfDiagnosis);
        assert.equal(updatedRecord.diagnosis, 'Updated Diagnosis');
        assert.equal(updatedRecord.symptoms, 'Updated Symptoms');
        assert.equal(updatedRecord.durationSeverity, 'Updated Duration Severity');
        assert.equal(updatedRecord.signs, 'Updated Signs');
        assert.equal(updatedRecord.relevantMedicalHistory, 'Updated Relevant Medical History');
    });
    
});
