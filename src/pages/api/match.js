import { ethers } from 'ethers'
import { NETWORK, CONTRACTS } from '../../config'
import gammaCardsAbi from '../../context/abis/GammaCards.v5.sol/NofGammaCardsV5.json'
import { getCardsByUser } from '../../services/gamma'

// example call: http://localhost:3000/api/match?w1=0x117b706DEF40310eF5926aB57868dAcf46605b8d&w2=0x35dad65F60c1A32c9895BE97f6bcE57D32792E83
export default async function handler(req, res) {
  try {
    const { w1, w2 } = req.query

    if (!w1 || !w2) {
      res.status(400).json({
        error: 'Please provide the wallet addresses (w1 and w2) as query parameters'
      })
      return
    }

    const provider = new ethers.providers.JsonRpcProvider(NETWORK.chainNodeProviderUrl)
    const gammaCardsContractInstance = new ethers.Contract(
      CONTRACTS.gammaCardsAddress,
      gammaCardsAbi.abi,
      provider
    )

    // stamped = true && quantity > 1
    const u1Cards = await getFilteredCards(gammaCardsContractInstance, w1)
    const u2Cards = await getFilteredCards(gammaCardsContractInstance, w2)

    // tiene user1 y no el user2 y viceversa
    const u1NotInU2 = getNotPresentCards(u1Cards, u2Cards)
    const u2NotInU1 = getNotPresentCards(u2Cards, u1Cards)

    const match = Object.keys(u1NotInU2).length > 0 || Object.keys(u2NotInU1).length > 0

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({
      user1: u1NotInU2,
      user2: u2NotInU1,
      match: match
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'An error occurred while processing the request.'
    })
  }
}

async function getFilteredCards(contractInstance, wallet) {
  const userCards = (await getCardsByUser(contractInstance, wallet)).user

  const filteredCards = Object.keys(userCards).reduce((filtered, key) => {
    const card = userCards[key]
    if (card.quantity > 1) {
      filtered[key] = card
    }
    return filtered
  }, {})

  return filteredCards
}

function getNotPresentCards(userCards1, userCards2) {
  const notPresentCards = {}
  Object.keys(userCards1).forEach((key) => {
    if (!userCards2[key]) {
      notPresentCards[key] = userCards1[key]
    }
  })
  return notPresentCards
}
