// API
// Environment variables are only available in the Node.js (server-side) environment, meaning they won't be exposed to the browser.
// In order to expose a variable to the browser (client-side) you have to prefix the variable with NEXT_PUBLIC_.
// ------------------------------------------------------------------
// server-side environment variables
// ------------------------------------------------------------------
export const BASE_URL = process.env.BASE_URL
export const MONGODB = process.env.MONGODB || 'mongodb://localhost:27017'
export const environment = (process.env.NODE_ENV || 'development').toLocaleLowerCase()
export const is_production = environment === 'production' || environment === 'prod'
export const gammaServiceUrl = (process.env.GAMMA_SERVICE_URL || 'https://gamma-microservice-7bteynlhua-uc.a.run.app')

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
    (is_production ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com')
}

export const CONTRACTS = {
  daiAddress:
    process.env.NEXT_PUBLIC_DAI_ADDRESS ||
    (is_production
      ? '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
      : '0x496E0cDfF61e86294F8F4ca8D3822C8Bd01949d1'),
  alphaAddress:
    process.env.NEXT_PUBLIC_ALPHA_ADDRESS ||
    (is_production
      ? '0xb187769912a3e52091477D885D95dDF2EC9c718e'
      : '0xa6E15E39ede08d7960359882696EC34D504b111A'),
  gammaCardsAddress:
    process.env.NEXT_PUBLIC_GAMMA_CARDS_ADDRESS || '0xEefF8D035A60AC3E1456991C2A2C2dEb31C84B76',
  gammaPackAddress:
    process.env.NEXT_PUBLIC_GAMMA_PACKS_ADDRESS || '0xDe30a1B73031ccB456967BE9f103DaF23A006d1b'
}

export const openSeaUrl = is_production
  ? `https://.opensea.io/assets/matic/${CONTRACTS.alphaAddress}/`
  : `https://testnets.opensea.io/assets/mumbai/${CONTRACTS.alphaAddress}/`

export const adminAccounts =
  process.env.NEXT_PUBLIC_ADMIN_ACCOUNTS || '0x8a8F5e5ae88532c605921f320a92562c9599fB9E'

// ------------------------------------------------------------------

export const defaultSettings = {
  languagePresets: 'es',
  languageSetted: 'es'
}

console.log(NETWORK, CONTRACTS)
// ------------------------------------------------------------------
