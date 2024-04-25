// import web3 from "./web3"
import Web3 from 'web3';

const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/rmGdl7bXf8ZITQxpNjpKc_9RrOnC0wYU');

const ContractABI = [{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"},{"internalType":"string","name":"_physician","type":"string"},{"internalType":"string","name":"_diagnosis","type":"string"},{"internalType":"string","name":"_signsAndSymptoms","type":"string"},{"internalType":"string","name":"_treatmentProcedure","type":"string"},{"internalType":"string","name":"_tests","type":"string"},{"internalType":"string","name":"_medications","type":"string"},{"internalType":"string","name":"_admission","type":"string"}],"name":"addMedicalHistory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_age","type":"string"},{"internalType":"string","name":"_gender","type":"string"},{"internalType":"string","name":"_dateOfBirth","type":"string"},{"internalType":"string","name":"_height","type":"string"},{"internalType":"string","name":"_weight","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_address","type":"string"}],"name":"addPatient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_addr","type":"string"}],"name":"editHospitalDetails","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"},{"internalType":"string","name":"_physician","type":"string"},{"internalType":"string","name":"_diagnosis","type":"string"},{"internalType":"string","name":"_signsAndSymptoms","type":"string"},{"internalType":"string","name":"_treatmentProcedure","type":"string"},{"internalType":"string","name":"_tests","type":"string"},{"internalType":"string","name":"_medications","type":"string"},{"internalType":"string","name":"_admission","type":"string"}],"name":"editMedicalHistory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_age","type":"string"},{"internalType":"string","name":"_gender","type":"string"},{"internalType":"string","name":"_dateOfBirth","type":"string"},{"internalType":"string","name":"_height","type":"string"},{"internalType":"string","name":"_weight","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_address","type":"string"}],"name":"editPatientDetails","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMedicalHistory","outputs":[{"components":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"internalType":"struct MediVerse.MedicalHistory[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"getAuthorizedHospitals","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"hospitalAddress","type":"address"}],"name":"getHospitalInfo","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getHospitalList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"getMedicalHistory","outputs":[{"components":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"internalType":"struct MediVerse.MedicalHistory[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"patientAddress","type":"address"}],"name":"getPatientInfo","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPatientList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"getPendingRequests","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_hospitalAddr","type":"address"}],"name":"givePermission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"hospitalList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hospitals","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"contactNum","type":"string"},{"internalType":"string","name":"addr","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"medicalHistories","outputs":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"medicalHistoryList","outputs":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"patientList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"patients","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"age","type":"string"},{"internalType":"string","name":"gender","type":"string"},{"internalType":"string","name":"dateOfBirth","type":"string"},{"internalType":"string","name":"height","type":"string"},{"internalType":"string","name":"weight","type":"string"},{"internalType":"string","name":"contactNum","type":"string"},{"internalType":"string","name":"addr","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_address","type":"string"}],"name":"registerHospital","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_age","type":"string"},{"internalType":"string","name":"_gender","type":"string"},{"internalType":"string","name":"_dateOfBirth","type":"string"},{"internalType":"string","name":"_height","type":"string"},{"internalType":"string","name":"_weight","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_address","type":"string"}],"name":"registerPatient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"requestPermission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_hospitalAddr","type":"address"}],"name":"revokeAccess","outputs":[],"stateMutability":"nonpayable","type":"function"}]

/**
 * * Tanggalin lang yung comment if gagamitin ang network and gawin comment yung hindi gagamitin
*/
const mvContract = new web3.eth.Contract(ContractABI, "0xe475599C0D109CA71afC0BEe3B78CBfB2ff01991"); // for network
//const mvContract = new web3.eth.Contract(ContractABI, "0x9Da81dF7A09028519c266173000A3339a896A62a"); //for development

/**
 * * Note: if gagamiting ang development, follow the steps below:
 * * 1. run ang ganache-cli
 * * 2. Open ng bagong terminal/bash and type 'truffle migrate'
 * * 3. copy yung contract address na lumabas doon then paste mo sa may loob ng " "  
 * ! const mvContract = new web3.eth.Contract(ContractABI, "sa loob neto"); 
 * * 4. import lang yung account sa metamask
 */

export default mvContract


// Starting migrations...
// ======================
// > Network name:    'sepolia'
// > Network id:      11155111
// > Block gas limit: 30000000 (0x1c9c380)


// 1_deploy_contract.js
// ====================

//    Replacing 'MediVerse'
//    ---------------------
//    > transaction hash:    0xfad91378639d9a6435cc0836bc45911b405ad6b564f3bbab4d90c07c6cfaf40a
//    > Blocks: 0            Seconds: 8
//    > contract address:    0xe475599C0D109CA71afC0BEe3B78CBfB2ff01991
//    > block number:        5774147
//    > block timestamp:     1714044948
//    > account:             0x0074F4724FeB0B8b98A629335831E3429Afb0a93
//    > balance:             1.390148396196333849
//    > gas used:            4897010 (0x4ab8f2)
//    > gas price:           6.425133455 gwei
//    > value sent:          0 ETH
//    > total cost:          0.03146394278046955 ETH

//    Pausing for 2 confirmations...

//    -------------------------------
//    > confirmation number: 1 (block: 5774148)
//    > confirmation number: 2 (block: 5774149)
//    > Saving artifacts
//    -------------------------------------
//    > Total cost:     0.03146394278046955 ETH

// Summary
// =======
// > Total deployments:   1
// > Final cost:          0.03146394278046955 ETH