import { ethers } from 'ethers'
import { CONTRACTS } from '../config'

export const checkBalance = async (daiContract, walletAddress) => {
  // Get the walletAddress balance from the Dai contract
  const balance = await daiContract.balanceOf(walletAddress)
  // Convert the balance from a BigNumber to a number
  const number = JSON.parse(ethers.BigNumber.from(balance).toString())

  // Set the minimum balance value to 1 Dai
  const minimum = 1000000000000000000

  // Return true if the walletAddress balance is greater than the minimum value, false otherwise
  return number > minimum
}

export const checkApproved = async (daiContract, tokenOwnerAddress, spenderAddress) => {
  const approved = await daiContract.allowance(tokenOwnerAddress, spenderAddress)
  return approved.gt(0)
}

export const authorizeDaiContract = async (daiContract) => {
  const authorization = await daiContract.approve(
    CONTRACTS.gammaPackAddress,
    ethers.constants.MaxUint256,
    { gasLimit: 2500000 }
  )
  await authorization.wait()
  return authorization
}
