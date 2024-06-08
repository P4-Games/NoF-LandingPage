import { graphUrl } from '../config'
import { ethers } from 'ethers'

const query = `
  query getSeasonWinners {
    winners(first: 1000) {
      season
      winner
      position
      blockTimestamp
    }
  }
`

export const fetchDataAlpha = async () => {
  try {
    const response = await fetch(graphUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    })
    const json = await response.json()
    return json
  } catch (e) {
    console.error({
      e
    })
  }
}

export const createNewSeason = async (alphaContract, name, price, amount = 60, folder = 'T1') => {
  const trx = await alphaContract.newSeason(
    name,
    ethers.utils.parseUnits(price, 18),
    amount,
    folder
  )
  await trx.wait()
  return true
}

export const getAlbumData = async (alphaContract, tokenId) => {
  const albumData = await alphaContract.cards(tokenId)
  return albumData
}

export const checkPacks = async (alphaContract, seasonName) => {
  try {
    const check = await alphaContract.getSeasonAlbums(seasonName)
    return check
  } catch (ex) {
    console.error(ex)
  }
}

export const getSeasonFolder = async (alphaContract, seasonName) => {
  try {
    const response = await alphaContract.seasons(seasonName)
    return response.folder
  } catch (ex) {
    console.error(ex)
  }
}

export const getUserCards = async (alphaContract, address, seasonName) => {
  try {
    const cards = await alphaContract.getCardsByUserBySeason(address, seasonName)
    return cards
  } catch (ex) {
    console.error(ex)
  }
}

export const getWinners = async (alphaContract, seasonName) => {
  try {
    const winners = await alphaContract.getWinners(seasonName)
    return winners
  } catch (ex) {
    console.error(ex)
  }
}

export const getAuthorized = async (alphaContract, address) => {
  try {
    const authorized = await alphaContract.getAuthorized(address)
    return authorized
  } catch (ex) {
    console.error(ex)
  }
}
