import Web3 from 'web3';

let web3;
let providerAPI = 'https://eth-sepolia.g.alchemy.com/v2/rmGdl7bXf8ZITQxpNjpKc_9RrOnC0wYU';

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
} else {
    // Non-dapp browsers or when MetaMask is not available
    web3 = new Web3(new Web3.providers.HttpProvider(providerAPI));
}

export default web3;
