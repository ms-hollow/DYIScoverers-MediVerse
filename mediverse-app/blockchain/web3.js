import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // Modern dapp browsers
    web3 = new Web3(window.ethereum);
} else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // Legacy dapp browsers
    web3 = new Web3(window.web3.currentProvider);
} else {
    // Non-dapp browsers or when MetaMask is not available
    const provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/e1e60ac355c7431fa8f20fe0e9482324');
    web3 = new Web3(provider);
}

export default web3;
