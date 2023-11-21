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
  daiAddress: process.env.NEXT_PUBLIC_DAI_ADDRESS || '0x1D8D8551525FC3acf557673609050501750a1696',
  alphaAddress:
    process.env.NEXT_PUBLIC_ALPHA_ADDRESS || '0x8bb6dF8590a5fA5BeE910C74B77c057bDb65393c',
  gammaPackAddress:
    process.env.NEXT_PUBLIC_GAMMA_PACKS_ADDRESS || '0xCe4cA167Eb99c6A2c738B04dd138172C281583dC',
  gammaCardsAddress:
    process.env.NEXT_PUBLIC_GAMMA_CARDS_ADDRESS || '0x87cDB9a4F34B27Ec31C71d0F5B8F70B9cD1232D7',
  gammaOffersAddress: process.env.NEXT_PUBLIC_GAMMA_OFFERS_ADDRESS || '0xE694a14Bb2682379D3D6c5c37cf6ba442ae6f4BA'
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
