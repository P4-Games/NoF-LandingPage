require('@nomicfoundation/hardhat-toolbox');

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.18',
      },
      {
        version: '0.8.17',
      },
      {
        version: '0.5.12',
      },
      {
        version: '0.8.0',
      },
      {
        version: '0.8.1',
      },
      {
        version: '0.6.6',
      },
    ],
  },
};
