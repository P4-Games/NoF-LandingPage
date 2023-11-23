import { ethers } from 'ethers'
import { hasCard } from './gamma'

export const createOffer = async (offersContract, cardsContract, cardNumber, wantedCards) => {
  try {
    const wantedCardNumbers = wantedCards.split(',').map((num) => parseInt(num.trim(), 10))

    for (const wantedCard of wantedCardNumbers) {
      const result = await hasCard(cardsContract, wantedCard)
      // console.log('has card')
      if (result) {
        throw new Error('publish_offer_error_own_card_number')
      }
    }

    console.log('createoffer', cardNumber, wantedCards, wantedCardNumbers)
    const trx = await offersContract.createOffer(cardNumber, wantedCardNumbers)
    await trx.wait()
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const removeOfferByCardNumber = async (offersContract, cardNumber) => {
  try {
    const trx = await offersContract.removeOfferByCardNumber(cardNumber)
    await trx.wait()
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const getOffers = async (offersContract) => {
  try {
    const trx = await offersContract.getOffers()
    return trx
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const getOffersByUser = async (offersContract, userAddress) => {
  try {
    const trx = await offersContract.getOffersByUser(userAddress)
    const result = await trx.wait()
    // console.log(result)
    return result
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const getOffersByCardNumber = async (offersContract, cardNumber) => {
  try {
    if (!offersContract) return

    // [0][0] offerId, [0][1] cardNumber, [0][2] wantedCards, [0][3] wallet que ofertó
    const offers = await offersContract.getOffersByCardNumber(cardNumber)
    // console.log('ofertas', offers)
    if (!offers) return []

    const offerObject = offers.map((item) => {
      const id = ethers.BigNumber.from(item[0]).toNumber()
      return {
        offerId: parseInt(id),
        offerWallet: item[3],
        offerCard: parseInt(item[1]),
        wantedCards: item[2]
      }
    })

    // console.log('getOffersByCardNumber result', offerObject)
    // El contrato puede devolver una ofer vacia en lugar de null,
    // por lo que quedará el offerId en 0
    const filteredResult = offerObject.filter((item) => item.offerId !== 0)

    return filteredResult
  } catch (e) {
    console.error({ e })
    throw e
  }
}
