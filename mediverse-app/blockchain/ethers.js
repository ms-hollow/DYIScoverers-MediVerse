import { providers } from 'ethers';

let provider;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // Modern dapp browsers
    provider = new providers.Web3Provider(window.ethereum);
} else {
    // Fallback to a default provider (e.g., Alchemy)
    provider = new providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/rmGdl7bXf8ZITQxpNjpKc_9RrOnC0wYU');
}

export default provider;