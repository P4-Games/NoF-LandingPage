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

import { removeQuotes } from './utils/stringUtils'

export const MONGODB = process.env.MONGODB || 'mongodb://localhost:27017'
export const environment = (process.env.NEXT_PUBLIC_APP_ENV || 'testing').toLowerCase()

export const gammaServiceUrl =
  process.env.GAMMA_SERVICE_URL || 'https://gamma-microservice-7bteynlhua-uc.a.run.app'

/*
export const graphUrl =
  process.env.GRAPH_URL || 'https://api.thegraph.com/subgraphs/name/tomasfrancizco/nof_polygon'
*/

export const MAIL_CONFIG = {
  client: process.env.MAIL_CLIENT || 'sendgrid',
  from: process.env.MAIL_FROM || 'no-reply@nof.town',
  to: process.env.MAIL_TO || 'dapps.ar@gmail.com',
  sg_key: process.env.MAIL_SG_KEY,
  sg_from: process.env.MAIL_SG_FROM || 'no-reply@nof.town',
  ethereal_host: process.env.MAIL_ETHEREAL_HOST || 'smtp.ethereal.email',
  ethereal_port: parseInt(process.env.MAIL_ETHEREAL_PORT || 587, 10),
  ethereal_user: process.env.MAIL_ETHEREAL_USER,
  ethereal_pswd: process.env.MAIL_ETHEREAL_PSWD
}

export const walletConnectProjectId =
  process.env.WALLET_CONNECT_PROJECT_ID || 'd66ff03f26d5a3ef19530ba69b815448'
// not exposed, included then in NETWORKS variable.
const NodeProviderUrlPolygon =
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
export const nofVersion = process.env.NOF_VERSION || 'v0.1.219'

// ------------------------------------------------------------------
// calculated variables
// ------------------------------------------------------------------

const hardhatContractAddressDAI = removeQuotes(
  process.env.NEXT_PUBLIC_NOF_DAI_HARDHAT_CONTRACT_ADDRESS
)
const hardhatContractAddressAlpha = removeQuotes(
  process.env.NEXT_PUBLIC_NOF_ALPHA_HARDHAT_CONTRACT_ADDRESS
)
const hardhatContractAddressGammaCards = removeQuotes(
  process.env.NEXT_PUBLIC_NOF_GAMMA_CARDS_HARDHAT_CONTRACT_ADDRESS
)
const hardhatContractAddressGammaPacks = removeQuotes(
  process.env.NEXT_PUBLIC_NOF_GAMMA_PACKS_HARDHAT_CONTRACT_ADDRESS
)
const hardhatContractAddressGammaOffers = removeQuotes(
  process.env.NEXT_PUBLIC_NOF_GAMMA_OFFERS_HARDHAT_CONTRACT_ADDRESS
)
const hardhatContractAddressGammaTickets = removeQuotes(
  process.env.NEXT_PUBLIC_NOF_GAMMA_TICKETS_HARDHAT_CONTRACT_ADDRESS
)

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
      environments: ['development'],
      chainName: 'localhost',
      chainId: {
        h: '0x539',
        d: 1337
      },
      chainCurrency: 'ETH',
      ChainRpcUrl: 'http://localhost:8545',
      chainExplorerUrl: 'http://localhost:8545',
      chainOpenSeaBaseUrl: 'https://testnets.opensea.io/assets/',
      chainNftUrl: '',
      chainNodeProviderUrl: NodeProviderUrlPolygon // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      // In local environment (hardhat), it take contracts addresss from environment variables
      daiAddress: hardhatContractAddressDAI,
      alphaAddress: hardhatContractAddressAlpha,
      gammaCardsAddress: hardhatContractAddressGammaCards,
      gammaPackAddress: hardhatContractAddressGammaPacks,
      gammaOffersAddress: hardhatContractAddressGammaOffers,
      gammaTicketsAddress: hardhatContractAddressGammaTickets
    }
  },
  amoy: {
    config: {
      enabled: 'true',
      environments: ['testing'],
      chainName: 'amoy',
      chainId: {
        h: '0x13882',
        d: 80002
      },
      chainCurrency: 'MATIC',
      ChainRpcUrl: 'https://rpc-amoy.polygon.technology',
      chainExplorerUrl: 'https://www.oklink.com/amoy',
      chainOpenSeaBaseUrl: 'https://testnets.opensea.io/assets/amoy',
      chainNftUrl: 'https://www.oklink.com/es-la/amoy/',
      chainNodeProviderUrl: NodeProviderUrlPolygon // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '0xd5654b986d5aDba8662c06e847E32579078561dC',
      alphaAddress: '0xBA5E2aF09e39CC36dfBc9530c4d4C89d5C44d323',
      gammaCardsAddress: '0xe6C812381DF5532A4bA4dA27baA1889adf67eec4',
      gammaPackAddress: '0xc616ac2191C6012791d3aBFA0e8f372579986090',
      gammaOffersAddress: '0x7DC00081F078D64B7b02535d82D3b6041D79Ce32',
      gammaTicketsAddress: '0xCD177Fa01b249Ee8ca1afF0136c06cD279E8Bf3e'
    }
  },
  mumbai: {
    config: {
      enabled: 'true',
      environments: ['testing'],
      chainName: 'mumbai',
      chainId: {
        h: '0x13881',
        d: 80001
      },
      chainCurrency: 'MATIC',
      ChainRpcUrl: 'https://rpc-mumbai.maticvigil.com',
      chainExplorerUrl: 'https://mumbai.polygonscan.com',
      chainOpenSeaBaseUrl: 'https://testnets.opensea.io/assets/mumbai',
      chainNftUrl:
        'https://mumbai.polygonscan.com/token/0x34658c07F05638E12793d0961595cBc72fA69452',
      chainNodeProviderUrl: NodeProviderUrlPolygon // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '0xEa4c35c858E15Cef77821278A88435dE57bc8707',
      alphaAddress: '0x816EA704F9bEf91284bA72bEBdAC1d1c5788246b',
      gammaCardsAddress: '0x394Fc1975972de88806b2E81Ed53f3E020f29D09',
      gammaPackAddress: '0xfb4C387227d3692Be50376ff930472294ADEcED8',
      gammaOffersAddress: '0x1eDB114Bb7A0CBaDA9c9550BD2F3F1bFC08Bd7a7',
      gammaTicketsAddress: '0x091C994c5766D79bF592e08C71D49C49Eaf1DCee'
    }
  },
  'bsc-testnet': {
    config: {
      enabled: 'true',
      environments: ['testing'],
      chainName: 'bsc-testnet',
      chainId: {
        h: '0x61',
        d: 97
      },
      chainCurrency: 'tBNB',
      ChainRpcUrl: 'https://bsc-testnet-dataseed.bnbchain.org',
      chainExplorerUrl: 'https://testnet.bscscan.com',
      chainOpenSeaBaseUrl: 'https://testnets.opensea.io/assets/bsc-testnet',
      chainNftUrl: 'https://testnet.bscscan.com/token/0x25f85D878972f9506b4De49cEff480f627935521',
      chainNodeProviderUrl: NodeProviderUrlbscTestnet // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '0x1ba960c6f624eC8d3fA3ACC4aFaF867538afd787',
      alphaAddress: '0x56e14bf3adBE4C7566b4F9dCC9acc264429f5DC9',
      gammaCardsAddress: '0x369443c3a885b6687d0f2a2Dc97b4EC69b9d90b3',
      gammaPackAddress: '0xA62A947c0BD0A14317A6EAd7e32b227f4F9C36ef',
      gammaOffersAddress: '0x4C1d15c7EcEDF52eE7073CeD26b0A6c482b27c69',
      gammaTicketsAddress: '0xC67963E0742074bfa74610D28663FB3a524201D8'
    }
  },
  'opbnb-testnet': {
    config: {
      enabled: 'true',
      environments: ['testing'],
      chainName: 'opBNB-testnet',
      chainId: {
        h: '0x15eb',
        d: 5611
      },
      chainCurrency: 'tBNB',
      ChainRpcUrl: 'https://opbnb-testnet-rpc.bnbchain.org',
      chainExplorerUrl: 'https://opbnb-testnet.bscscan.com',
      chainOpenSeaBaseUrl: '',
      chainNftUrl: 'https://testnet.opbnbscan.com/token/0x2842c8fd88f801018e53dddebbc944ae377d0f72',
      chainNodeProviderUrl: NodeProviderUrlopBnbTestnet // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '0xE3Afd0e2b6b955a56A1823039DE577d3ce7B15BC',
      alphaAddress: '0xaAf52b86Cb71c14bd01eC6AC88481BC94470fFD7',
      gammaCardsAddress: '0x4a65B5138fCaBFE8a7c676688E9884F1eBdc1906',
      gammaPackAddress: '0xd792e3040FaCa21E0a7414422DeC6000Cc66BB79',
      gammaOffersAddress: '0xB90B462d5c609CC548a8135C264b212688A9Fe1f',
      gammaTicketsAddress: '0xa7ec2fd75cAfd694866AF76e865D8b34b24CB5D8'
    }
  },
  matic: {
    config: {
      enabled: 'true',
      environments: ['production'],
      chainName: 'matic',
      chainId: {
        h: '0x89',
        d: 137
      },
      chainCurrency: 'MATIC',
      ChainRpcUrl: 'https://polygon-mainnet.infura.io',
      chainExplorerUrl: 'https://polygonscan.com',
      chainOpenSeaBaseUrl: 'https://opensea.io/assets/matic',
      chainNftUrl: 'https://polygonscan.com/token/0x0a703481a0c67b9a4ee0ee49945f193f117f7505',
      chainNodeProviderUrl: NodeProviderUrlPolygon // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      alphaAddress: '0x5A2ccC423C0C36A1B05a080eb4972993a1Dd0980',
      gammaCardsAddress: '0x0a703481a0C67B9A4EE0EE49945F193f117F7505',
      gammaPackAddress: '0x78E491965a1A8646643126A38C8217CfA27F2339',
      gammaOffersAddress: '0x94Ac8Cb81Ef3c3B056dca42974bF8A57A7B9BA03',
      gammaTicketsAddress: '0x0DC4f203E9113018010720484d35a4bfa1c0beA5'
    }
  },
  sepolia: {
    config: {
      enabled: 'true',
      environments: ['production', 'testing'],
      chainName: 'sepolia',
      chainId: {
        h: '0xaa36a7',
        d: 11155111
      },
      chainCurrency: 'ETH',
      ChainRpcUrl: 'https://1rpc.io/sepolia',
      chainExplorerUrl: 'https://sepolia.etherscan.io',
      chainOpenSeaBaseUrl: 'https://testnets.opensea.io',
      chainNftUrl: '',
      chainNodeProviderUrl: NodeProviderUrlPolygon // visible ONLY in server side code! (in cliente side will be undefined)
    },
    contracts: {
      daiAddress: '0x916153db00beD5Df8D242d54FE116226Fd9Aa12F',
      alphaAddress: '0x08EDe954E7582c14E59E295dCb9a2c7f211d2B9c',
      gammaCardsAddress: '0xaf1BDeFC663a5f9A47679f1B0468BCa2f41650F5',
      gammaPackAddress: '0x2C5e7B01639621ff5A402984E3d18454190f30Ee',
      gammaOffersAddress: '0x0d0E683E567881C714a2E1096dEC774D72591D02',
      gammaTicketsAddress: '0xD96c2655c8c04b4Bab2E0664F7ed3179a2d05d14'
    }
  }
}

// ------------------------------------------------------------------
