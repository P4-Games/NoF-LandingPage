# Number One Fun (NoF)

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
MONGODB='mongodb://localhost:27017'
NODE_ENV='development'
NEXT_PUBLIC_STORAGE_URL='https://storage.googleapis.com/nof-alpha/'
NEXT_PUBLIC_CHAIN_NAME='mumbai'
NEXT_PUBLIC_CHAIN_ID='0x13881'
NEXT_PUBLIC_CHAIN_CURRENCY='MATIC'
NEXT_PUBLIC_CHAIN_RPC_URL='https://rpc-mumbai.maticvigil.com'
NEXT_PUBLIC_CHAIN_EXPLORER_URL='https://mumbai.polygonscan.com/'
NEXT_PUBLIC_DAI_ADDRESS='0x59876b33dd6e725Da632B4DB50d90d33ab022dB6'
NEXT_PUBLIC_ALPHA_ADDRESS='0x1772F33b587B4ed32f59Dc6B09B9e994616C1eCB'
NEXT_PUBLIC_GAMMA_PACKS_ADDRESS='0xc0a2630f551106190d95C2348e02E400478e711c'
NEXT_PUBLIC_GAMMA_CARDS_ADDRESS='0xa888449f2CB7AB034D08051Bf1a9D7402DE959ab'
NEXT_PUBLIC_ADMIN_ACCOUNTS='0x35dad65F60c1A32c9895BE97f6bcE57D32792E83,0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

```

The source code of the smart contracts is located at [https://github.com/P4-Games/NoF-Smart-Contracts](https://github.com/P4-Games/NoF-Smart-Contracts). If you want to run them locally (example: on a hardhat or ganache node), after compiling them locally, change the addresses in the .env and set these options to network:

```sh
NEXT_PUBLIC_CHAIN_NAME='localhost'
NEXT_PUBLIC_CHAIN_ID='0x539'
NEXT_PUBLIC_CHAIN_CURRENCY='ETH'
NEXT_PUBLIC_CHAIN_RPC_URL='http://localhost:8545'
```

## Quick commands

### Install dependencies

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

### Run App

```sh
npm run dev / yarn dev
```

### Use App

```sh
Open browser in http://localhost:3000/
```

