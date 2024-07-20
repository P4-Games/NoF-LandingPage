import { ethers } from 'ethers'

import { handleError } from './handleError'
import { fetchWithRetry } from './middleware'

export const getSeasonData = async (alphaContract, walletAddress) => {
  // Define la función de solicitud
  const key = `fetchSeasonData-${walletAddress}`
  const requestFunc = async () => {
    const seasonData = await alphaContract.getSeasonData()
    return seasonData
  }
  const seasonData = await fetchWithRetry(key, requestFunc)
  return seasonData
}
export const createNewSeason = async (alphaContract, name, price, amount = 60, folder = 'T1') => {
  try {
    const estimatedGas = await alphaContract.estimateGas.newSeason(
      name,
      ethers.utils.parseUnits(price, 18),
      amount,
      folder
    )
    const gasLimit = estimatedGas.mul(ethers.BigNumber.from(120)).div(ethers.BigNumber.from(100))

    const trx = await alphaContract.newSeason(
      name,
      ethers.utils.parseUnits(price, 18),
      amount,
      folder,
      {
        gasLimit
      }
    )
    await trx.wait()
    return true
  } catch (e) {
    handleError('0x', 'createNewSeason', e)
    throw e
  }
}

export const buyPack = async (alphaContract, packPrice, seasonName) => {
  const estimatedGas = await alphaContract.estimateGas.buyPack(packPrice, seasonName)
  const gasLimit = estimatedGas.mul(ethers.BigNumber.from(120)).div(ethers.BigNumber.from(100))
  try {
    const trx = await alphaContract.buyPack(packPrice, seasonName, {
      gasLimit
    })
    await trx.wait()
    return trx
  } catch (e) {
    handleError('0x', 'buyPack', e)
    throw e
  }
}

export const transferCard = async (alphaContract, from, to, tokenId) => {
  const estimatedGas = await alphaContract.estimateGas.transferFrom(from, to, tokenId)
  const gasLimit = estimatedGas.mul(ethers.BigNumber.from(120)).div(ethers.BigNumber.from(100))
  try {
    const trx = await alphaContract.transferFrom(from, to, tokenId, {
      gasLimit
    })
    await trx.wait()
    return true
  } catch (e) {
    handleError('0x', 'transferCard', e)
    throw e
  }
}

export const pasteCard = async (alphaContract, cardTokenId, albumTokenId) => {
  const estimatedGas = await alphaContract.estimateGas.pasteCards(cardTokenId, albumTokenId)
  const gasLimit = estimatedGas.mul(ethers.BigNumber.from(120)).div(ethers.BigNumber.from(100))
  try {
    const trx = await alphaContract.pasteCards(cardTokenId, albumTokenId, {
      gasLimit
    })
    await trx.wait()
    return true
  } catch (e) {
    handleError('0x', 'pasteCard', e)
    throw e
  }
}

export const getAlbumData = async (alphaContract, tokenId) => {
  try {
    // console.log('calling getAlbumData')
    const albumData = await alphaContract.cards(tokenId)
    return albumData
  } catch (e) {
    handleError('0x', 'getAlbumData', e)
    throw e
  }
}

export const checkPacks = async (alphaContract, seasonName) => {
  try {
    // console.log('calling checkPacks')
    const packs = await alphaContract.getSeasonAlbums(seasonName)
    return packs
  } catch (e) {
    handleError('0x', 'checkPacks', e)
    throw e
  }
}

export const getSeasonFolder = async (alphaContract, seasonName) => {
  try {
    // console.log('calling getSeasonFolder')
    const response = await alphaContract.seasons(seasonName)
    return response.folder
  } catch (e) {
    handleError('0x', 'getSeasonFolder', e)
    throw e
  }
}

export const getUserCards = async (alphaContract, address, seasonName) => {
  try {
    // console.log('calling getUserCards')
    const cards = await alphaContract.getCardsByUserBySeason(address, seasonName)
    return cards
  } catch (e) {
    handleError('0x', 'getUserCards', e)
    throw e
  }
}

export const getWinnersBySeason = async (alphaContract, seasonName) => {
  try {
    // console.log('calling getWinnersBySeason')
    const winners = await alphaContract.getWinners(seasonName)
    return winners
  } catch (e) {
    handleError('0x', 'getWinnersBySeason', e)
    throw e
  }
}

export const getAuthorized = async (alphaContract, address) => {
  try {
    // console.log('calling getAuthorized')
    const authorized = await alphaContract.getAuthorized(address)
    return authorized
  } catch (e) {
    handleError('0x', 'getAuthorized', e)
    throw e
  }
}

export const getSeasonPlayers = async (alphaContract, seasonName) => {
  try {
    // console.log('calling getSeasonPlayers')
    const players = await alphaContract.getSeasonPlayers(seasonName)
    return players
  } catch (e) {
    handleError('0x', 'getSeasonPlayers', e)
    throw e
  }
}
