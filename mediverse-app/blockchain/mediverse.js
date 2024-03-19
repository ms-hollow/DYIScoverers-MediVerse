import Web3 from 'web3'
import ContractABI from '../blockchain/build/blockchain_contracts_MediVerse_sol_MediVerse.abi';

const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/ba7390d6d72340dda62d7e63700bded8"
)

const web3 = new Web3(provider)

const vmContract = new web3.eth.Contract(ContractABI, " "); //lagay sa " " ang deployed contract sa sepolia network

export default vmContract