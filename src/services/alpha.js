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

const getAlbumData = async (alphaContract, tokenId) => {
  const albumData = await alphaContract.cards(tokenId)
  return albumData
}
