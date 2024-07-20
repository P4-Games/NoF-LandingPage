import { ethers } from 'ethers'

export const mintDai = async (daiContract, walletAddress, amount) => {
  const trx = await daiContract._mint(walletAddress, ethers.utils.parseUnits(amount, 18))
  await trx.wait()
  return true
}

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

export const checkBalance = async (daiContract, walletAddress, daiNeeded) => {
  const balance = await daiContract.balanceOf(walletAddress)
  const number = JSON.parse(ethers.BigNumber.from(balance).toString())
  return number >= daiNeeded
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
  try {
    const authorization = await daiContract.approve(spenderAddress, amount, {
      gasLimit: 2500000
    })
    await authorization.wait()
    return authorization
  } catch (e) {
    console.error({
      e
    })
    return false
  }
}

export const getTokenName = async (daiContract) => {
  try {
    const tokenName = await daiContract.name()
    return tokenName || 'DAI'
  } catch (e) {
    console.error('Error al obtener el nombre del token:', e)
    return 'DAI'
  }
}
