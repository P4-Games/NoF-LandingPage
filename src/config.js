// API
// Environment variables are only available in the Node.js (server-side) environment, meaning they won't be exposed to the browser.
// In order to expose a variable to the browser (client-side) you have to prefix the variable with NEXT_PUBLIC_.
// ------------------------------------------------------------------
// server-side environment variables
// ------------------------------------------------------------------
export const BASE_URL = process.env.BASE_URL
export const MONGODB = process.env.MONGODB || 'mongodb://localhost:27017'
export const environment = (process.env.APP_ENV || 'development').toLowerCase()
export const is_production = environment === 'production' || environment === 'prod'
export const gammaServiceUrl =
  process.env.GAMMA_SERVICE_URL || 'https://gamma-microservice-7bteynlhua-uc.a.run.app'
export const graphUrl =
  process.env.GRAPH_URL || 'https://api.thegraph.com/subgraphs/name/tomasfrancizco/nof_polygon'

// ------------------------------------------------------------------
// client-side environment variables
// ------------------------------------------------------------------
export const storageUrlAlpha =
  process.env.NEXT_PUBLIC_STORAGE_URL_ALPHA || 'https://storage.googleapis.com/nof-alpha'
export const storageUrlGamma =
  process.env.NEXT_PUBLIC_STORAGE_URL_GAMMA || 'https://storage.googleapis.com/nof-gamma'

export const NETWORK = {
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || (is_production ? 'Polygon Mainnet' : 'Mumbai'),
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || (is_production ? '0x89' : '0x13881'),
  chainCurrency: process.env.NEXT_PUBLIC_CHAIN_CURRENCY || 'MATIC',
  ChainRpcUrl:
    process.env.NEXT_PUBLIC_CHAIN_RPC_URL ||
    (is_production ? 'https://polygon-mainnet.infura.io' : 'https://rpc-mumbai.maticvigil.com'),
  chainExplorerUrl:
    process.env.NEXT_PUBLIC_CHAIN_EXPLORER_URL ||
    (is_production ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com'),
  chainNodeProviderUrl:
    process.env.NEXT_PUBLIC_CHAIN_NODE_PROVIDER_URL ||
    'https://polygon-mumbai.g.alchemy.com/v2/6Ge-klr1O_0kD4ZUSAFffyC7QNNEOJZJ'
}

export const WalletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'bc09ad4a99cebe270fcc24bd6925f4fe'

export const CONTRACTS = {
  daiAddress: process.env.NEXT_PUBLIC_DAI_ADDRESS || '0xf16Df332faDAA3Be759a006E04292f5ad759b059',
  alphaAddress:
    process.env.NEXT_PUBLIC_ALPHA_ADDRESS || '0xA9890ba6D781194954b76676d57C895cF3975EA9',
  gammaPackAddress:
    process.env.NEXT_PUBLIC_GAMMA_PACKS_ADDRESS || '0x4A27F9FE1378A4De546d328F0756a6b8cb2e75c7',
  gammaCardsAddress:
    process.env.NEXT_PUBLIC_GAMMA_CARDS_ADDRESS || '0x2577b49B886EFdE2BBa68A953d0C241Fd60e0d9a',
  gammaOffersAddress: process.env.NEXT_PUBLIC_GAMMA_OFFERS_ADDRESS || ''
}

export const openSeaUrlAlpha = is_production
  ? `https://.opensea.io/assets/matic/${CONTRACTS.alphaAddress}`
  : `https://testnets.opensea.io/assets/mumbai/${CONTRACTS.alphaAddress}`

export const openSeaUrlGamma = is_production
  ? `https://.opensea.io/assets/matic/${CONTRACTS.gammaCardsAddress}`
  : `https://testnets.opensea.io/assets/mumbai/${CONTRACTS.gammaCardsAddress}`

export const adminAccounts =
  process.env.NEXT_PUBLIC_ADMIN_ACCOUNTS || '0x8a8F5e5ae88532c605921f320a92562c9599fB9E'

// ------------------------------------------------------------------

export const defaultSettings = {
  languagePresets: 'es',
  languageSetted: 'es'
}

console.log(NETWORK, CONTRACTS)
// ------------------------------------------------------------------
