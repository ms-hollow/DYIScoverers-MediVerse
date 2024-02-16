const AccessControl = artifacts.require("AccessControlContract");
const Patient = artifacts.require("PatientRecords");
const Hospital = artifacts.require("HospitalRecords");  // Corrected contract name
const MedicalHistory = artifacts.require("MedicalHistoryRecords");
const MedicalProcedureHistory = artifacts.require("MedicalProcedureHistory");
const LaboratoryHistory = artifacts.require("LaboratoryHistoryRecords");
const HospitalizationHistory = artifacts.require("HospitalizationHistoryRecords");
const AllergyHistory = artifacts.require("AllergyHistoryRecords");

module.exports = async function(deployer) {
  // Deploy Hospital contract first 
  await deployer.deploy(Hospital);

  // Deploy AccessControlContract with Hospital address
  await deployer.deploy(AccessControl, Hospital.address);

  // Deploy other contracts with potential dependencies
  await deployer.deploy(Patient, AccessControl.address);
  await deployer.deploy(MedicalHistory, AccessControl.address);
  await deployer.deploy(MedicalProcedureHistory, AccessControl.address);
  await deployer.deploy(LaboratoryHistory, AccessControl.address);
  await deployer.deploy(HospitalizationHistory, AccessControl.address);
  await deployer.deploy(AllergyHistory, AccessControl.address);
};
