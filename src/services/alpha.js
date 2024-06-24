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

export const fetchWinnersQuery = async () => {
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
    return false
  }
}

export const createNewSeason = async (alphaContract, name, price, amount = 60, folder = 'T1') => {
  try {
    const trx = await alphaContract.newSeason(
      name,
      ethers.utils.parseUnits(price, 18),
      amount,
      folder
    )
    await trx.wait()
    return true
  } catch (e) {
    console.error({
      e
    })
    return false
  }
}

export const buyPack = async (alphaContract, packPrice, seasonName) => {
  try {
    const trx = await alphaContract.buyPack(packPrice, seasonName)
    await trx.wait()
    return trx
  } catch (e) {
    console.error({
      e
    })
    return false
  }
}

export const transferCard = async (alphaContract, from, to, tokenId) => {
  try {
    const trx = await alphaContract.transferFrom(from, to, tokenId)
    await trx.wait()
    return true
  } catch (e) {
    console.error({
      e
    })
    return false
  }
}

export const pasteCard = async (alphaContract, cardTokenId, albumTokenId) => {
  try {
    const trx = await alphaContract.pasteCards(cardTokenId, albumTokenId, {
      gasLimit: 2500000
    })
    await trx.wait()
    return true
  } catch (e) {
    console.error({
      e
    })
    return false
  }
}

export const getAlbumData = async (alphaContract, tokenId) => {
  try {
    const albumData = await alphaContract.cards(tokenId)
    return albumData
  } catch (e) {
    console.error({
      e
    })
    return e
  }
}

export const checkPacks = async (alphaContract, seasonName) => {
  try {
    const packs = await alphaContract.getSeasonAlbums(seasonName)
    return packs
  } catch (e) {
    console.error({
      e
    })
    return false
  }
}

export const getSeasonFolder = async (alphaContract, seasonName) => {
  try {
    const response = await alphaContract.seasons(seasonName)
    return response.folder
  } catch (e) {
    console.error({
      e
    })
    return false
  }
}

export const getUserCards = async (alphaContract, address, seasonName) => {
  try {
    const cards = await alphaContract.getCardsByUserBySeason(address, seasonName)
    return cards
  } catch (e) {
    console.error({
      e
    })
    return false
  }
}

export const getWinnersBySeason = async (alphaContract, seasonName) => {
  try {
    const winners = await alphaContract.getWinners(seasonName)
    return winners
  } catch (e) {
    console.error({
      e
    })
    return false
  }
}

export const getAuthorized = async (alphaContract, address) => {
  try {
    const authorized = await alphaContract.getAuthorized(address)
    return authorized
  } catch (e) {
    console.error({
      e
    })
    return e
  }
}

export const getSeasonPlayers = async (alphaContract, seasonName) => {
  try {
    const players = await alphaContract.getSeasonPlayers(seasonName)
    return players
  } catch (e) {
    console.error({
      e
    })
    return e
  }
}
