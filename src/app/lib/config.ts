export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

export const alchemySolanaChainTypes: Record<string,string> = {
    main: 'https://solana-mainnet.g.alchemy.com/v2',
    test: 'https://solana-devnet.g.alchemy.com/v2'
}

export const alchemyEthereumChainTypes: Record<string,string> = {
    main: 'https://eth-mainnet.g.alchemy.com/v2',
    test: 'https://eth-sepolia.g.alchemy.com/v2'
}

