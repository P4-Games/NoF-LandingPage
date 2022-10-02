// https://eth-goerli.g.alchemy.com/v2/APXjeq7Nui4f49M53IW7VlyzfxBqfLkM

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/APXjeq7Nui4f49M53IW7VlyzfxBqfLkM',
      accounts: [ '7691324d842c25abef68e348c88c370e79a816ab8ab7921b0839770df40f943c' ]
    }
  }
}