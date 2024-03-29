import web3 from "./web3"

const ContractABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"patientAddr","type":"address"},{"indexed":false,"internalType":"address","name":"hospitalAddr","type":"address"}],"name":"GeneralHealthProfileAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"hospitalAddr","type":"address"}],"name":"HospitalRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"patientAddr","type":"address"},{"indexed":false,"internalType":"address","name":"hospitalAddr","type":"address"}],"name":"MedicalHistoryAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"patientAddr","type":"address"}],"name":"PatientRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"patientAddr","type":"address"},{"indexed":false,"internalType":"address","name":"hospitalAddr","type":"address"}],"name":"PermissionGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"patientAddr","type":"address"},{"indexed":false,"internalType":"address","name":"hospitalAddr","type":"address"}],"name":"PermissionRevoked","type":"event"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"},{"internalType":"string","name":"_physician","type":"string"},{"internalType":"string","name":"_diagnosis","type":"string"},{"internalType":"string","name":"_signsAndSymptoms","type":"string"},{"internalType":"string","name":"_treatmentProcedure","type":"string"},{"internalType":"string","name":"_tests","type":"string"},{"internalType":"string","name":"_medications","type":"string"},{"internalType":"string","name":"_admission","type":"string"}],"name":"addMedicalHistory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_addr","type":"string"}],"name":"editHospitalDetails","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"},{"internalType":"string","name":"_physician","type":"string"},{"internalType":"string","name":"_diagnosis","type":"string"},{"internalType":"string","name":"_signsAndSymptoms","type":"string"},{"internalType":"string","name":"_treatmentProcedure","type":"string"},{"internalType":"string","name":"_tests","type":"string"},{"internalType":"string","name":"_medications","type":"string"},{"internalType":"string","name":"_admission","type":"string"}],"name":"editMedicalHistory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_age","type":"string"},{"internalType":"string","name":"_gender","type":"string"},{"internalType":"string","name":"_dateOfBirth","type":"string"},{"internalType":"string","name":"_height","type":"string"},{"internalType":"string","name":"_weight","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_address","type":"string"}],"name":"editPatientDetails","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMedicalHistory","outputs":[{"components":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"internalType":"struct MediVerse.MedicalHistory[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"getAuthorizedHospitals","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"hospitalAddress","type":"address"}],"name":"getHospitalInfo","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getHospitalList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"getMedicalHistory","outputs":[{"components":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"internalType":"struct MediVerse.MedicalHistory[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"patientAddress","type":"address"}],"name":"getPatientInfo","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPatientList","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_patientAddr","type":"address"}],"name":"getPendingRequests","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_hospitalAddr","type":"address"}],"name":"givePermission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"hospitalList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hospitals","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"contactNum","type":"string"},{"internalType":"string","name":"addr","type":"string"},{"internalType":"uint256","name":"registrationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"medicalHistories","outputs":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"medicalHistoryList","outputs":[{"internalType":"address","name":"patientAddr","type":"address"},{"internalType":"address","name":"hospitalAddr","type":"address"},{"internalType":"string","name":"physician","type":"string"},{"internalType":"string","name":"diagnosis","type":"string"},{"internalType":"string","name":"signsAndSymptoms","type":"string"},{"internalType":"string","name":"treatmentProcedure","type":"string"},{"internalType":"string","name":"tests","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"admission","type":"string"},{"internalType":"uint256","name":"creationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"patientList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"patients","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"age","type":"string"},{"internalType":"string","name":"gender","type":"string"},{"internalType":"string","name":"dateOfBirth","type":"string"},{"internalType":"string","name":"height","type":"string"},{"internalType":"string","name":"weight","type":"string"},{"internalType":"string","name":"contactNum","type":"string"},{"internalType":"string","name":"addr","type":"string"},{"internalType":"uint256","name":"registrationDate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingRequests","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_address","type":"string"}],"name":"registerHospital","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_age","type":"string"},{"internalType":"string","name":"_gender","type":"string"},{"internalType":"string","name":"_dateOfBirth","type":"string"},{"internalType":"string","name":"_height","type":"string"},{"internalType":"string","name":"_weight","type":"string"},{"internalType":"string","name":"_contactNum","type":"string"},{"internalType":"string","name":"_address","type":"string"}],"name":"registerPatient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_hospitalAddr","type":"address"}],"name":"revokeAccess","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"query","type":"string"}],"name":"searchByName","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"}]

/**
 * * Tanggalin lang yung comment if gagamitin ang network and gawin comment yung hindi gagamitin
*/
//const mvContract = new web3.eth.Contract(ContractABI, "0x83Fc7DF031178dcD27Ee8C3fd4f8C729D6Cdf8f9"); // for network
const mvContract = new web3.eth.Contract(ContractABI, "0xFaF49CdA118fBB7EFF98068BA15E4Ef19661dDe9"); //for development

/**
 * * Note: if gagamiting ang development, follow the steps below:
 * * 1. run ang ganache-cli
 * * 2. Open ng bagong terminal/bash and type 'truffle migrate'
 * * 3. copy yung contract address na lumabas doon then paste mo sa may loob ng " "  
 * ! const mvContract = new web3.eth.Contract(ContractABI, "sa loob neto"); 
 * * 4. import lang yung account sa metamask
 */

export default mvContract