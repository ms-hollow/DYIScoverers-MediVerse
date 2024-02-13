const HospitalRecords = artifacts.require("HospitalRecords");

contract("HospitalRecords", (accounts) => {
    let hospitalRecords;

    beforeEach(async () => {
        hospitalRecords = await HospitalRecords.new();
    });

    it('should deploy a contract', async () => {
        assert.ok(hospitalRecords.address);
    });

    const truffleAssert = require('truffle-assertions');

    it('can register a hospital', async () => {
        const tx = await hospitalRecords.registerHospital(
            'XYZ Hospital',
            '1234567890',
            '123 Hospital St',
            { from: accounts[0], gas: 2000000 }
        );
    
        const event = await truffleAssert.createTransactionResult(hospitalRecords, tx.tx);
    
        // Retrieve hospital details from the emitted event
        const hospitalName = event.logs[0].args.hospitalName;
        const contactNum = event.logs[0].args.contactNum;
        const hospitalAddress = event.logs[0].args.hospitalAddress;
    
        console.log('Hospital Name:', hospitalName);
        console.log('Contact Number:', contactNum);
        console.log('Hospital Address:', hospitalAddress);
    
        assert.equal(hospitalName, 'XYZ Hospital');
        assert.equal(contactNum, '1234567890');
        assert.equal(hospitalAddress, '123 Hospital St');
    });

    it('can edit hospital profile', async () => {
        await hospitalRecords.registerHospital(
            'ABC Hospital',
            '9876543210',
            '789 Side St',
            { from: accounts[0] }
        );

        await hospitalRecords.editHospitalProfile(
            'Updated ABC Hospital',
            '5555555555',
            '123 New St',
            { from: accounts[0] }
        );

        const updatedHospital = await hospitalRecords.hospitals(accounts[0]);

        assert.equal(updatedHospital.hospitalName, 'Updated ABC Hospital');
        assert.equal(updatedHospital.contactNum, '5555555555');
        assert.equal(updatedHospital.hospitalAddress, '123 New St');
    });
});