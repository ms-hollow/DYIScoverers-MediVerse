const Record = artifacts.require("Record");
const Patient = artifacts.require("PatientRecords");
const Hospital = artifacts.require("HospitalRecords");
const MedicalHistory = artifacts.require("MedicalHistoryRecords");
const MedicalProcedureHistory = artifacts.require("MedicalProcedureHistory");
const LaboratoryHistory = artifacts.require("LaboratoryHistoryRecords");
const HospitalizationHistory = artifacts.require("HospitalizationHistoryRecords");
const AllergyHistory = artifacts.require("AllergyHistoryRecords");

module.exports = async function (deployer) {
  // Deploy contracts without explicit dependencies
  await deployer.deploy(Patient);
  await deployer.deploy(Hospital);
  await deployer.deploy(MedicalHistory);
  await deployer.deploy(MedicalProcedureHistory);
  await deployer.deploy(LaboratoryHistory);
  await deployer.deploy(HospitalizationHistory);
  await deployer.deploy(AllergyHistory);

  // Deploy the Record contract
  await deployer.deploy(Record);
};
