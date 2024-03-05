/** @type import('hardhat/config').HardhatUserConfig */

const solidityVersions = ["0.6.0", "0.6.2", "0.6.6", "0.8.18", "0.8.20"]
const compilers = solidityVersions.map((version) => ({
  version,
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}))

module.exports = {
  solidity: {
    compilers
  },
};