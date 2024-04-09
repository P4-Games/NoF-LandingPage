![](https://img.shields.io/badge/NextJs-informational?style=flat&logo=next&logoColor=white&color=6aa6f8)
![](https://img.shields.io/badge/JavaScript-informational?style=flat&logo=javascript&logoColor=white&color=6aa6f8)
![](https://img.shields.io/badge/scss-informational?style=flat&logo=scss&logoColor=white&color=6aa6f8)
![](https://img.shields.io/badge/Solidity-informational?style=flat&logo=solidity&logoColor=white&color=6aa6f8)
![](https://img.shields.io/badge/Hardhat-informational?style=flat&logo=hardhat&logoColor=white&color=6aa6f8)

# Number One Fan (NoF)

![nof-landing](./.doc/images/nof.png)

# Build With

- [nextJs Framework](https://nextjs.org/)

# Live Demo

- [NoF Live Demo](https://nof.town)

# Requirements

## Software

This App requires:

- [nvm](https://github.com/nvm-sh/nvm) (allows you to quickly install and use different versions of node via the command line.)
- node js & npm (insalled with nvm)
- [mongo db](https://www.mongodb.com/docs/manual/installation/) (It will be used for endpoints that are consumed from the discord bot)
- [metamask](https://metamask.io/download/)

## Environment variables

Create a .env file running the command in terminal

```sh
touch .env
```

The environment variables bellow needs to be set in the .env file when project is running locally:

```sh
SKIP_PREFLIGHT_CHECK=true
GENERATE_SOURCEMAP=false
npm_config_user_agent=yarn
PORT=3000

# server-side
MONGODB='mongodb://localhost:27017'
GAMMA_SERVICE_URL='https://gamma-microservice-7bteynlhua-uc.a.run.app'
GRAPH_URL='https://api.thegraph.com/subgraphs/name/tomasfrancizco/nof_polygon'
WALLET_CONNECT_PROJECT_ID={you project ID from walletconnect.com}
CHAIN_NODE_PROVIDER_URL='https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY'

# Client-side
NEXT_PUBLIC_APP_ENV='development'
NEXT_PUBLIC_STORAGE_URL_ALPHA='https://storage.googleapis.com/nof-alpha'
NEXT_PUBLIC_STORAGE_URL_GAMMA='https://storage.googleapis.com/nof-gamma'
NEXT_PUBLIC_ADMIN_ACCOUNTS='0x35dad65F60c1A32c9895BE97f6bcE57D32792E83,0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

# Only por local environment to put contracts addresses from hardhat
NEXT_PUBLIC_NOF_DAI_HARDHAT_CONTRACT_ADDRESS=''
NEXT_PUBLIC_NOF_ALPHA_HARDHAT_CONTRACT_ADDRESS=''
NEXT_PUBLIC_NOF_GAMMA_CARDS_HARDHAT_CONTRACT_ADDRESS=''
NEXT_PUBLIC_NOF_GAMMA_PACKS_HARDHAT_CONTRACT_ADDRESS=''
NEXT_PUBLIC_NOF_GAMMA_OFFERS_HARDHAT_CONTRACT_ADDRESS=''
NEXT_PUBLIC_NOF_GAMMA_TICKETS_HARDHAT_CONTRACT_ADDRESS=''


```

The source code of the smart contracts is located at [https://github.com/P4-Games/NoF-Smart-Contracts](https://github.com/P4-Games/NoF-Smart-Contracts). If you want to run them locally (example: on a hardhat or ganache node), after compiling them locally, change the addresses in the .env and set these options to network:

```sh
NEXT_PUBLIC_CHAIN_NAME='localhost'
NEXT_PUBLIC_CHAIN_ID='0x539'
NEXT_PUBLIC_CHAIN_CURRENCY='ETH'
NEXT_PUBLIC_CHAIN_RPC_URL='http://localhost:8545'
```

# Quick commands

## Install dependencies

```sh
- yarn install # with yarn
- npm i # with NPM
```

If you have troubles with dependencies, try this:

```sh
set http_proxy=
set https_proxy=
npm config rm https-proxy
npm config rm proxy
npm config set registry "https://registry.npmjs.org"
yarn cache clean
yarn config delete proxy
yarn --network-timeout 100000
```

## Run App

```sh
npm run dev / yarn dev
```

## Use App

```sh
Open browser in http://localhost:3000/
```

## Mock Data

You can load mock data from the alpha, gamma collections and have DAIs in your wallet in a local environment, with these commands:

```sh
# go to the root of the NoF-smart-contracts project and run
npx hardhat node # to raise the hardhat node
yarn deploy-mock-data # run the mock data

# Then upload the hardhat addresses to your wallets
```

# Collaborators

[P4Troy](https://github.com/mpefaur) - [dvj](https://github.com/dappsar) - [tomasfrancisco](https://github.com/tomasfrancizco) [NextDoor](https://github.com/NextDoor95) - [Julian624](https://github.com/julian624) - [Gabriel Vazquez](https://github.com/gavafue) - [Ezeee](https://github.com/EperezOk)

Thank you for considering helping out with the source code! We welcome contributions from anyone on the internet, and are grateful for even the smallest of fixes!

If you'd like to contribute to NoF, please fork, fix, commit and send a pull request for the maintainers to review and merge into the main code base. If you wish to submit more complex changes though, please check up with the [core devs](https://github.com/P4-Games/NoF-LandingPage/graphs/contributors) first to ensure those changes are in line with the general philosophy of the project and/or get some early feedback which can make both your efforts much lighter as well as our review and merge procedures quick and simple.

Please make sure your contributions adhere to our [coding guidelines](./.doc/contribution.md).

## Contributors

[P4Troy](https://github.com/mpefaur) - [dappsar](https://github.com/dappsar) - [tomasfrancisco](https://github.com/tomasfrancizco) [NextDoor](https://github.com/NextDoor95) - [Julian624](https://github.com/julian624) - [Gabriel Vazquez](https://github.com/gavafue) - [Ezeee](https://github.com/EperezOk)

see more in: https://github.com/P4-Games/NoF-LandingPage/graphs/contributors

# Links

- BNB & opBNB node provider: [nodereal.io](https://nodereal.io/)
