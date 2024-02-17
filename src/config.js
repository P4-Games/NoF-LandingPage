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
      daiAddress: '0xfbC22278A96299D91d41C453234d97b4F5Eb9B2d',
      alphaAddress: '0x46b142DD1E924FAb83eCc3c08e4D46E82f005e0E',
      gammaCardsAddress: '0xC9a43158891282A2B1475592D5719c001986Aaec',
      gammaPackAddress: '0x1c85638e118b37167e9298c2268758e058DdfDA0',
      gammaOffersAddress: '0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb',
      gammaTicketsAddress: '0x4C2F7092C2aE51D986bEFEe378e50BD4dB99C901'
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
      alphaAddress: '0x7C201e88e43b5FBEEfB77F966c2a5D2E09178B49',
      gammaCardsAddress: '0x34658c07F05638E12793d0961595cBc72fA69452',
      gammaPackAddress: '0xDc06FbD70b2159863d079aE282d69AEe8a88A18E',
      gammaOffersAddress: '0x3Da346C40A0D90cf5642944613586439A3456d45',
      gammaTicketsAddress: '0x7593aad3e13fBd27F113aad8688E8817Ac4f9A33'
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
      daiAddress: '0x83330b5803838604d85B7Cba393C930084F45A7d',
      alphaAddress: '0x4eE8C9cc2cF081f11F56A264EF52e3FeaDe1b35e',
      gammaCardsAddress: '0x25f85D878972f9506b4De49cEff480f627935521',
      gammaPackAddress: '0x71aA05fD8532a1395DffaB6FdA8be191fC8168FE',
      gammaOffersAddress: '0x168eE5cfE8b7EDC7F24cA0326DFfF3Ef6DF37f2F',
      gammaTicketsAddress: '0xA5c3Cd20AB6FF1e299D93ee268370BCC19a32E71'
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
      daiAddress: '0x46480E0d10966Ea274831D9693a56f9c09D7339d',
      alphaAddress: '0x36f19A5397DbE26b548b15C158f7a8e00979B408',
      gammaCardsAddress: '0x2842c8FD88F801018E53dDDeBbC944aE377D0F72',
      gammaPackAddress: '0x1116218412559628B67aa15F3c527D68F0A71b91',
      gammaOffersAddress: '0xe810524F7C7C62A2201FdF1bCA20649Bd7D70844',
      gammaTicketsAddress: '0xd9988C491805AE2573FA156b27CDE1a6f7B3E073'
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
