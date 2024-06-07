import { graphUrl } from '../config'

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
      body: JSON.stringify({ query })
    })
    const json = await response.json()
    return json
  } catch (e) {
    console.error({ e })
  }
}

export const createNewSeason = async (alphaContract, name, price) => {
  const amount = 60;
  const folder = 'T1';
  console.log({alphaContract}, {name}, {price}, {amount}, {folder})
  // const trx = await alphaContract.newSeason(name, price, amount, folder)
  // await trx.wait()
  return true
}