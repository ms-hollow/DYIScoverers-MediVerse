import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
} else {
    // Non-dapp browsers or when MetaMask is not available
    web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/rmGdl7bXf8ZITQxpNjpKc_9RrOnC0wYU');
}

export default web3;
