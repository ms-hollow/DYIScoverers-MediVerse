const PatientRecords = artifacts.require("PatientRecords");

contract("PatientRecords", (accounts) => {
    
    let patientRecords;

    beforeEach(async () => {
        patientRecords = await PatientRecords.new();
    });

    it('should deploy a contract', async () => {
        assert.ok(patientRecords.address);
    });

    it('can register a patient', async () => {
        await patientRecords.registerPatient(
            'John Doe',
            '1234567890',
            'Male',
            '30',
            '01/01/1992',
            '180',
            '70',
            '123 Main St',
            { from: accounts[0] }
        );

        const patient = await patientRecords.patients(accounts[0]);

        assert.equal(patient.name, 'John Doe');
        assert.equal(patient.phone, '1234567890');
        assert.equal(patient.gender, 'Male');
        assert.equal(patient.age, '30');
        assert.equal(patient.dateOfBirth, '01/01/1992');
        assert.equal(patient.height, '180');
        assert.equal(patient.weight, '70');
        assert.equal(patient.houseAddress, '123 Main St')
    });

    it('can edit patient profile', async () => {
        await patientRecords.registerPatient(
            'John Doe',
            '1234567890',
            'Male',
            '30',
            '01/01/1992',
            '180',
            '70',
            '123 Main St',
            { from: accounts[0] }
        );

        await patientRecords.editPatientProfile(
            'Updated John Doe',
            '9876543210',
            '02/02/1992',
            '175',
            '75',
            '456 Side St',
            { from: accounts[0] }
        );

        const updatedPatient = await patientRecords.patients(accounts[0]);

        assert.equal(updatedPatient.name, 'Updated John Doe');
        assert.equal(updatedPatient.phone, '9876543210');
    });
});
