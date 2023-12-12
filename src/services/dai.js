import { ethers } from 'ethers'

export const transfer = async (daiContract, walletAddress, amount) => {
  const trx = await daiContract.transfer(walletAddress, ethers.utils.parseUnits(amount, 18))
  await trx.wait()
  return true
}

export const getBalance = async (daiContract, walletAddress) => {
  if (!daiContract || !walletAddress) return
  const balance = await daiContract.balanceOf(walletAddress)
  const number = parseInt(ethers.utils.formatUnits(balance, 18))
  return number
}

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

export const checkApproved = async (daiContract, tokenOwnerAddress, spenderAddress, amount = 0) => {
  const approved = await daiContract.allowance(tokenOwnerAddress, spenderAddress)
  return approved.gt(amount)
}

export const authorizeDaiContract = async (
  daiContract,
  spenderAddress,
  amount = ethers.constants.MaxUint256
) => {
  const authorization = await daiContract.approve(spenderAddress, amount, { gasLimit: 2500000 })
  await authorization.wait()
  return authorization
}

export const getTokenName = async (daiContract) => {
  try {
    const tokenName = await daiContract.name()
    return tokenName || 'DAI'
  } catch (error) {
    console.error('Error al obtener el nombre del token:', error)
    return 'DAI'
  }
}
