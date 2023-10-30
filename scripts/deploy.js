// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function main() {
  const accounts = await hre.ethers.getSigners();

  const TestDAI = await hre.ethers.getContractFactory('Dai');
  const testDAI = await TestDAI.deploy(1);

  await testDAI.deployed();

  console.log(`Test DAI SC deployed to ${testDAI.address}`);

  const baseURI =
    'https://gateway.pinata.cloud/ipfs/QmZuSMk8d8Xru6J1PKMz5Gt6Qq8qVQ1Ak8p661zdGmGbGx/';

  const NofSC = await hre.ethers.getContractFactory('NOF_Alpha');
  const nofSC = await NofSC.deploy(baseURI, testDAI.address);

  await nofSC.deployed();

  console.log(`NOF Alpha SC deployed to ${nofSC.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
