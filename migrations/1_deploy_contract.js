const MediVerse = artifacts.require("MediVerse");

module.exports = async function (deployer) {
  // Deploy contracts without explicit dependencies
  await deployer.deploy(MediVerse);
};
