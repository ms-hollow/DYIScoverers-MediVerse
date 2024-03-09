const MediVerse = artifacts.require('MediVerse');

contract('MediVerse', (accounts) => {
  
    let mediVerseInstance;
    const patientAddress = accounts[1];
    const hospitalAddress = accounts[2];
    const patientAddress2 = accounts[3];
    const hospitalAddress2 = accounts[4];

    beforeEach(async () => {
        mediVerseInstance = await MediVerse.new();
    });

    it('should deploy a contract', async () => {
        assert.ok(mediVerseInstance.address);
    });

    it('should register a new patient', async () => {
        await mediVerseInstance.registerPatient(
            'Abby Leonen',
            '09876543213',
            'Female',
            '01/01/1990',
            '180cm',
            '75kg',
            '123 Main St QC',
            { from: patientAddress }
        );

        const patient = await mediVerseInstance.patients(patientAddress);
        assert.equal(patient.name, 'Abby Leonen', 'Patient name not set correctly');
    });

    it('can edit patient profile', async () => {
        await mediVerseInstance.registerPatient(
            'Abby Leonen',
            '09876543213',
            'Female',
            '01/01/1990',
            '180cm',
            '75kg',
            '123 Main St QC',
            { from: patientAddress }
        );

        await mediVerseInstance.editPatientDetails(
            'Abby Miles',
            '09876543213',
            'Female',
            '01/01/1990',
            '150cm',
            '40kg',
            '123 Main St QC',
            { from: patientAddress }
        );

        const updatedPatient = await mediVerseInstance.patients(patientAddress);
        assert.equal(updatedPatient.name, 'Abby Miles');
    });

    it('can register hospital', async () => {
        await mediVerseInstance.registerHospital(
            'East Avenue Hospital',
            '1234567890',
            '123 Diliman St',
            { from: hospitalAddress }
        );

        const hospital = await mediVerseInstance.hospitals(hospitalAddress);
        assert.equal(hospital.name, 'East Avenue Hospital', 'Hospital name not set correctly');
    });

    it('can edit hospital profile', async () => {
        await mediVerseInstance.registerHospital(
            'East Avenue Hospital',
            '1234567890',
            '123 Diliman St',
            { from: hospitalAddress }
        );
    
        await mediVerseInstance.editHospitalDetails(
            'Updated East Avenue Hospital',
            '1234567890',
            '123 Diliman St',
            { from: hospitalAddress }
        );
    
        const updatedHospital = await mediVerseInstance.hospitals(hospitalAddress);
        assert.equal(updatedHospital.name, 'Updated East Avenue Hospital');
    });

    it('can authorize the hospital to access patient records', async () => {
        await mediVerseInstance.registerPatient(
            'Abby Leonen',
            '09876543213',
            'Female',
            '01/01/1990',
            '180cm',
            '75kg',
            '123 Main St QC',
            { from: patientAddress }
        );
    
        await mediVerseInstance.registerHospital(
            'East Avenue Hospital',
            '1234567890',
            '123 Diliman St',
            { from: hospitalAddress }
        );
    
        await mediVerseInstance.givePermission(hospitalAddress, { from: patientAddress });
    
    });
    
    it('can add patient medical history', async () => {
        // Register the patient
        await mediVerseInstance.registerPatient(
            'Abby Leonen',
            '09876543213',
            'Female',
            '01/01/1990',
            '180cm',
            '75kg',
            '123 Main St QC',
            { from: patientAddress }
        );
    
        // Register the hospital
        await mediVerseInstance.registerHospital(
            'East Avenue Hospital',
            '1234567890',
            '123 Diliman St',
            { from: hospitalAddress }
        );
    
        // Authorize the hospital
        await mediVerseInstance.givePermission(hospitalAddress, { from: patientAddress });
    
        // Add medical history
        await mediVerseInstance.addMedicalHistory(
            patientAddress,
            'Dr. Paulo Alcantara - Pediatrician',
            'Acute Bronchitis - February 15, 2024 - Patient presented with cough, fever, and wheezing.',
            'Cough: 3 days - Moderate - Chest + Fever: 2 days - Mild - Generalized + Wheezing: 2 days - Severe - Chest',
            'Nebulization Therapy: Respiratory Therapy Team - February 15, 2024 - February 17, 2024 - 3 days +  Antibiotic Therapy: Dr. Maria Rodriguez - February 15, 2024 - February 20, 2024 - 5 days',
            'Chest X-ray: Dr. Paulo Alcantara - February 15, 2024 - Dr. Maria Rodriguez - Patchy infiltrates consistent with bronchitis. + Complete Blood Count (CBC): Dr. Paulo Alcantara - February 15, 2024 - Dr. Maria Rodriguez - Elevated white blood cell count indicating infection.',
            'Amoxicillin: Dr. Maria Rodriguez - 3 times daily - 7 days - February 15, 2024 - February 22, 2024',
            'East Avenue Hospital - February 15, 2024 - February 22, 2024 - 7 days',
            { from: hospitalAddress }
        );
    });
});
