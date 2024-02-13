const Patient = artifacts.require("PatientRecords");
const Hospital = artifacts.require("HospitalRecords");
const MedicalHistory = artifacts.require("MedicalHistoryRecords")

module.exports = function(deployer) {
  deployer.deploy(Patient);
  deployer.deploy(Hospital);
  deployer.deploy(MedicalHistory)
};