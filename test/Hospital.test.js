const HospitalRecords = artifacts.require("HospitalRecords");

contract("HospitalRecords", (accounts) => {
    let hospitalRecords;

    beforeEach(async () => {
        hospitalRecords = await HospitalRecords.new();
    });

    it('should deploy a contract', async () => {
        assert.ok(hospitalRecords.address);
    });

    it('can register a hospital', async () => {
        await hospitalRecords.registerHospital(
            'East Avenue Medical Center',
            '29280611',
            'East Ave, Diliman, Quezon City, 1100 Metro Manila',
            { from: accounts[0] }
        );

        const hospital = await hospitalRecords.hospitals(accounts[0]); 

        assert.equal(hospital.hospitalName, 'East Avenue Medical Center');
        assert.equal(hospital.contactNum, '29280611');
        assert.equal(hospital.hospitalAddress, 'East Ave, Diliman, Quezon City, 1100 Metro Manila');
    });

    it('can edit hospital profile', async () => {
        await hospitalRecords.registerHospital(
            'East Avenue Medical Center',
            '29280611',
            'East Ave, Diliman, Quezon City, 1100 Metro Manila',
            { from: accounts[0] }
        );

        await hospitalRecords.editHospitalProfile(
            'Updated East Avenue Medical Center',
            '29280611',
            'East Ave, Diliman, Quezon City, 1100 Metro Manila',
            { from: accounts[0] }
        );

        const updatedHospital = await hospitalRecords.hospitals(accounts[0]);

        assert.equal(updatedHospital.hospitalName, 'Updated East Avenue Medical Center'); 
    });
});
