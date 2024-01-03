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
    process.env.NEXT_PUBLIC_CHAIN_NODE_PROVIDER_URL || 'https://polygon-mumbai.g.alchemy.com/v2/'
}

export const WalletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

export const CONTRACTS = {
  daiAddress: process.env.NEXT_PUBLIC_DAI_ADDRESS || '0xEa4c35c858E15Cef77821278A88435dE57bc8707',
  alphaAddress:
    process.env.NEXT_PUBLIC_ALPHA_ADDRESS || '0x7C201e88e43b5FBEEfB77F966c2a5D2E09178B49',
  gammaCardsAddress:
    process.env.NEXT_PUBLIC_GAMMA_CARDS_ADDRESS || '0x34658c07F05638E12793d0961595cBc72fA69452',
  gammaPackAddress:
    process.env.NEXT_PUBLIC_GAMMA_PACKS_ADDRESS || '0xDc06FbD70b2159863d079aE282d69AEe8a88A18E',
  gammaOffersAddress:
    process.env.NEXT_PUBLIC_GAMMA_OFFERS_ADDRESS || '0x3Da346C40A0D90cf5642944613586439A3456d45',
  gammaTicketsAddress:
    process.env.NEXT_PUBLIC_GAMMA_TICKETS_ADDRESS || '0x7593aad3e13fBd27F113aad8688E8817Ac4f9A33'
}

export const openSeaUrlAlpha = is_production
  ? `https://opensea.io/assets/matic/${CONTRACTS.alphaAddress}`
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

export const MAIL_CONFIG = {
  client: process.env.MAIL_CLIENT || 'ethereal',
  from: process.env.MAIL_FROM || 'no-reply@nof.town',
  to: process.env.MAIL_TO || 'dapps.ar@gmail.com',
  sg_key: process.env.MAIL_SG_KEY,
  sg_from: process.env.MAIL_SG_FROM || 'no-reply@nof.town',
  ethereal_host: process.env.MAIL_ETHEREAL_HOST || 'smtp.ethereal.email',
  ethereal_port: process.env.MAIL_ETHEREAL_PORT || 587,
  ethereal_user: process.env.MAIL_ETHEREAL_USER,
  ethereal_pswd: process.env.MAIL_ETHEREAL_PSWD
}

export const MAIL_TYPE = {
  reportError: 'REPORT_ERROR'
}

export const MAIL_CLIENT = {
  sendgrid: 'sendgrid',
  ethereal: 'ethereal'
}

console.info('Network and Contracts', NETWORK, CONTRACTS, WalletConnectProjectId)
// ------------------------------------------------------------------
