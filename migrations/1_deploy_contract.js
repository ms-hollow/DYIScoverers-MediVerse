const Records = artifacts.require("Records");
const Patient = artifacts.require("PatientRecords");
const Hospital = artifacts.require("HospitalRecords");

module.exports = function(deployer) {
  deployer.deploy(Records);
  deployer.deploy(Patient);
  deployer.deploy(Hospital);
};