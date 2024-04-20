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
    const provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/ba7390d6d72340dda62d7e63700bded8');
    web3 = new Web3(provider);
}

export default web3;
