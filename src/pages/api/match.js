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
    const u1Cards = (await getCardsByUser(gammaCardsContractInstance, w1)).user
    const u2Cards = (await getCardsByUser(gammaCardsContractInstance, w2)).user

    // TODO: obtener repetidas
    // TODO: ver las que ambos no tienen
    // TODO: obtener match

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({
      user1: u1Cards,
      user2: u2Cards,
      match: false
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'An error occurred while processing the request.'
    })
  }
}
