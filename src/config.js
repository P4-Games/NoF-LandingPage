/*
// Environment configuration
// 
// Environment variables are only available in the Node.js (server-side) environment, meaning they won't be exposed to the browser.
// (You can't see with console.log(variable_name)!!!)
// 
// In order to expose a variable to the browser (client-side) you have to prefix the variable with NEXT_PUBLIC_. 
// The environment variables without that prefix are accessible in the nextJs backend (nodeJs) and UNDEFINED on the frontend 
// as expected which is good (for security reasons).
// Take care that the variables in frontend are REPLACED by webpack in build time (yarn build / npm build).  
// If after the build, you change the value of the variable, this will have no effect. You have to do the build again.
//
// ------------------------------------------------------------------
// server-side environment variables
// ------------------------------------------------------------------
*/
export const MONGODB = process.env.MONGODB || 'mongodb://localhost:27017'
export const environment = (process.env.NEXT_PUBLIC_APP_ENV || 'testing').toLowerCase()

export const gammaServiceUrl =
  process.env.GAMMA_SERVICE_URL || 'https://gamma-microservice-7bteynlhua-uc.a.run.app'

export const graphUrl =
  process.env.GRAPH_URL || 'https://api.thegraph.com/subgraphs/name/tomasfrancizco/nof_polygon'

export const MAIL_CONFIG = {
  client: process.env.MAIL_CLIENT || 'sendgrid',
  from: process.env.MAIL_FROM || 'no-reply@nof.town',
  to: process.env.MAIL_TO || 'dapps.ar@gmail.com',
  sg_key: process.env.MAIL_SG_KEY,
  sg_from: process.env.MAIL_SG_FROM || 'no-reply@nof.town',
  ethereal_host: process.env.MAIL_ETHEREAL_HOST || 'smtp.ethereal.email',
  ethereal_port: parseInt(process.env.MAIL_ETHEREAL_PORT || 587),
  ethereal_user: process.env.MAIL_ETHEREAL_USER,
  ethereal_pswd: process.env.MAIL_ETHEREAL_PSWD
}

export const walletConnectProjectId =
  process.env.WALLET_CONNECT_PROJECT_ID || 'd66ff03f26d5a3ef19530ba69b815448'
// not exposed, included then in NETWORKS variable.
const NodeProviderUrlMumbai =
  process.env.NODE_PROVIDER_MUMBAI_URL || 'https://polygon-mumbai.g.alchemy.com/v2/'
const NodeProviderUrlbscTestnet = process.env.NODE_PROVIDER_BSC_TESTNET_URL
const NodeProviderUrlopBnbTestnet = process.env.NODE_PROVIDER_OPBNB_TESTNET

// ------------------------------------------------------------------
// client-side environment variables
// ------------------------------------------------------------------
export const storageUrlAlpha =
  process.env.NEXT_PUBLIC_STORAGE_URL_ALPHA || 'https://storage.googleapis.com/nof-alpha'
export const storageUrlGamma =
  process.env.NEXT_PUBLIC_STORAGE_URL_GAMMA || 'https://storage.googleapis.com/nof-gamma'
export const adminAccounts =
  process.env.NEXT_PUBLIC_ADMIN_ACCOUNTS || '0x8a8F5e5ae88532c605921f320a92562c9599fB9E'

// ------------------------------------------------------------------
// calculated variables
// ------------------------------------------------------------------

export const defaultSettings = {
  languagePresets: 'es',
  languageSetted: 'es'
}

export const MAIL_TYPE = {
  reportError: 'REPORT_ERROR'
}

export const MAIL_CLIENT = {
  sendgrid: 'sendgrid',
  ethereal: 'ethereal'
}

export const NETWORKS = {
  hardhat: {
    config: {
      enabled: 'true',
      environment: 'development',
      chainName: 'localhost',
      chainId: '0x539',
      chainCurrency: 'ETH',
      ChainRpcUrl: 'http://localhost:8545',
      chainExplorerUrl: 'http://localhost:8545',
      chainOpenSeaBaseUrl: 'https://testnets.opensea.io/assets/',
      chainNftUrl: '',
      chainNodeProviderUrl: NodeProviderUrlMumbai // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      alphaAddress: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      gammaCardsAddress: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
      gammaPackAddress: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
      gammaOffersAddress: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
      gammaTicketsAddress: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318'
    }
  },
  mumbai: {
    config: {
      enabled: 'true',
      environment: 'testing',
      chainName: 'mumbai',
      chainId: '0x13881',
      chainCurrency: 'MATIC',
      ChainRpcUrl: 'https://rpc-mumbai.maticvigil.com',
      chainExplorerUrl: 'https://mumbai.polygonscan.com',
      chainOpenSeaBaseUrl: 'https://testnets.opensea.io/assets/mumbai',
      chainNftUrl:
        'https://mumbai.polygonscan.com/token/0x34658c07F05638E12793d0961595cBc72fA69452',
      chainNodeProviderUrl: NodeProviderUrlMumbai // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '0xEa4c35c858E15Cef77821278A88435dE57bc8707',
      alphaAddress: '0xf9e8570b88798CcC3bde56C6Eb7dF60C6DAA84Fe',
      gammaCardsAddress: '0x560c7d01011fbBF0438C804365cfea4B61E8985c',
      gammaPackAddress: '0x8b22aacc17b81610449FC978B0df558dA447A7A6',
      gammaOffersAddress: '0xd1f5FBBDACe8bE489246099603eeF5866EA1544e',
      gammaTicketsAddress: '0x34D6e75f13dA814dDEde5ce20afC245103A54edf'
    }
  },
  'bsc-testnet': {
    config: {
      enabled: 'true',
      environment: 'testing',
      chainName: 'bsc-testnet',
      chainId: '0x61',
      chainCurrency: 'tBNB',
      ChainRpcUrl: 'https://bsc-testnet-dataseed.bnbchain.org',
      chainExplorerUrl: 'https://testnet.bscscan.com',
      chainOpenSeaBaseUrl: 'https://testnets.opensea.io/assets/bsc-testnet',
      chainNftUrl: 'https://testnet.bscscan.com/token/0x25f85D878972f9506b4De49cEff480f627935521',
      chainNodeProviderUrl: NodeProviderUrlbscTestnet // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '0xF292D1ea9f5AAFFc24bC8831EF772cc4ab10cAEe',
      alphaAddress: '0x5FADd1178f6962c4cB7369CBE30f45212aBC3e12',
      gammaCardsAddress: '0x449392C509B218043b2d23262F06c834F2C3f5D9',
      gammaPackAddress: '0x9085a89Fe556f3180f328942832E44bDD4aeF54A',
      gammaOffersAddress: '0xE513DC5C4c789Da7B308E4a76786Ed97eE44d4BE',
      gammaTicketsAddress: '0xE8c40aaB664D9353753a80c3a68F011985E8D039'
    }
  },
  'opbnb-testnet': {
    config: {
      enabled: 'true',
      environment: 'testing',
      chainName: 'opBNB-testnet',
      chainId: '0x15eb',
      chainCurrency: 'tBNB',
      ChainRpcUrl: 'https://opbnb-testnet-rpc.bnbchain.org',
      chainExplorerUrl: 'https://opbnb-testnet.bscscan.com',
      chainOpenSeaBaseUrl: '',
      chainNftUrl: 'https://testnet.opbnbscan.com/token/0x2842c8fd88f801018e53dddebbc944ae377d0f72',
      chainNodeProviderUrl: NodeProviderUrlopBnbTestnet // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '0x8d2a7988FbF205724fcF40387A7A3b9eE89B97a1',
      alphaAddress: '0x2BEBce69E67B9b4a29eb0BA363245f9B82004503',
      gammaCardsAddress: '0xCcCC970eb4A307E75d6fe0C1D42f0Fd0C6cA6BeA',
      gammaPackAddress: '0x87502b899F3f6eA979C9e7DD5abDA95ce4Fbc247',
      gammaOffersAddress: '0x03388a96d37Aea7E302DB897aDacc9De433799c5',
      gammaTicketsAddress: '0x5d8fF80112c1a9C6Ed1593405f9Fb145F72f38a9'
    }
  },
  matic: {
    config: {
      enabled: 'false',
      environment: 'production',
      chainName: 'matic',
      chainId: '0x89',
      chainCurrency: 'MATIC',
      ChainRpcUrl: 'https://polygon-mainnet.infura.io',
      chainExplorerUrl: 'https://polygonscan.com',
      chainOpenSeaBaseUrl: 'https://opensea.io/assets/matic',
      chainNftUrl: '',
      chainNodeProviderUrl: NodeProviderUrlMumbai // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '',
      alphaAddress: '',
      gammaCardsAddress: '',
      gammaPackAddress: '',
      gammaOffersAddress: '',
      gammaTicketsAddress: ''
    }
  }
}

// ------------------------------------------------------------------
