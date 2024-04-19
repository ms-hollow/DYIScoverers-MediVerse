import web3 from "./web3"

const ContractABI = [{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"},{"internalType":"string","name":"_physician","type":"string"},{"internalType":"string","name":"_diagnosis","type":"string"},{"internalType":"string","name":"_signsAndSymptoms","type":"string"},{"internalType":"string","name":"_treatmentProcedure","type":"string"},{"internalType":"string","name":"_tests","type":"string"},{"internalType":"string","name":"_medications","type":"string"},{"internalType":"string","name":"_admission","type":"string"}],"name":"addMedicalHistory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_addr","type":"string"}],"name":"editHospitalDetails","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"},{"internalType":"string","name":"_physician","type":"string"},{"internalType":"string","name":"_diagnosis","type":"string"},{"internalType":"string","name":"_signsAndSymptoms","type":"string"},{"internalType":"string","name":"_treatmentProcedure","type":"string"},{"internalType":"string","name":"_tests","type":"string"},{"internalType":"string","name":"_medications","type":"string"},{"internalType":"string","name":"_admission","type":"string"}],"name":"editMedicalHistory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_age","type":"string"},{"internalType":"string","name":"_gender","type":"string"},{"internalType":"string","name":"_dateOfBirth","type":"string"},{"internalType":"string","name":"_height","type":"string"},{"internalType":"string","name":"_weight","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_address","type":"string"}],"name":"editPatientDetails","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMedicalHistory","outputs":[{"components":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"internalType":"struct MediVerse.MedicalHistory[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"getAuthorizedHospitals","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"hospitalAddress","type":"address"}],"name":"getHospitalInfo","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getHospitalList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"getMedicalHistory","outputs":[{"components":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"internalType":"struct MediVerse.MedicalHistory[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"patientAddress","type":"address"}],"name":"getPatientInfo","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPatientList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"getPendingRequests","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_hospitalAddr","type":"address"}],"name":"givePermission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"hospitalList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hospitals","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"contactNum","type":"string"},{"internalType":"string","name":"addr","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"medicalHistories","outputs":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"medicalHistoryList","outputs":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"patientList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"patients","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"age","type":"string"},{"internalType":"string","name":"gender","type":"string"},{"internalType":"string","name":"dateOfBirth","type":"string"},{"internalType":"string","name":"height","type":"string"},{"internalType":"string","name":"weight","type":"string"},{"internalType":"string","name":"contactNum","type":"string"},{"internalType":"string","name":"addr","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_address","type":"string"}],"name":"registerHospital","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_age","type":"string"},{"internalType":"string","name":"_gender","type":"string"},{"internalType":"string","name":"_dateOfBirth","type":"string"},{"internalType":"string","name":"_height","type":"string"},{"internalType":"string","name":"_weight","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_address","type":"string"}],"name":"registerPatient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"requestPermission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_hospitalAddr","type":"address"}],"name":"revokeAccess","outputs":[],"stateMutability":"nonpayable","type":"function"}]

/**
 * * Tanggalin lang yung comment if gagamitin ang network and gawin comment yung hindi gagamitin
*/
//const mvContract = new web3.eth.Contract(ContractABI, "0x639413bC3B343667E7d8FF662Ce8a6EEfe7A7B0A"); // for network
const mvContract = new web3.eth.Contract(ContractABI, "0x58549D8CFFb21b8340EDdBAd7678018652f699d4"); //for development

/**
 * * Note: if gagamiting ang development, follow the steps below:
 * * 1. run ang ganache-cli
 * * 2. Open ng bagong terminal/bash and type 'truffle migrate'
 * * 3. copy yung contract address na lumabas doon then paste mo sa may loob ng " "  
 * ! const mvContract = new web3.eth.Contract(ContractABI, "sa loob neto"); 
 * * 4. import lang yung account sa metamask
 */

export default mvContract

// 1_deploy_contract.js
// ====================

//    Deploying 'MediVerse'
//    ---------------------
//    > transaction hash:    0x6420f9e0b2c595ebe692d82fb382e31bf367c448291578fa9854834d6917de44
//    > Blocks: 2            Seconds: 24
//    > contract address:    0x639413bC3B343667E7d8FF662Ce8a6EEfe7A7B0A
//    > block number:        5724438
//    > block timestamp:     1713440652
//    > account:             0x77BC521989EfB176291BE7343E19025b7d7fC004
//    > balance:             10.421602020271997396
//    > gas used:            5017973 (0x4c9175)
//    > gas price:           94.435184315 gwei
//    > value sent:          0 ETH
//    > total cost:          0.473873205142693495 ETH

//    Pausing for 2 confirmations...

//    -------------------------------
//    > confirmation number: 1 (block: 5724440)
//    > confirmation number: 2 (block: 5724441)
//    > Saving artifacts
//    -------------------------------------
//    > Total cost:     0.473873205142693495 ETH

// Summary
// =======
// > Total deployments:   1
// > Final cost:          0.473873205142693495 ETH
