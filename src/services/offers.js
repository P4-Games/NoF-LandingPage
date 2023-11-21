import { hasCard } from './gamma'

export const createOffer = async (offersContract, cardsContract, cardNumber, wantedCards) => {
  try {
    const wantedCardNumbers = wantedCards.split(',').map((num) => parseInt(num.trim(), 10))

    for (const wantedCard of wantedCardNumbers) {
      const result = await hasCard(cardsContract, wantedCard)
      console.log('has card')
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

export const getOffersByUser = async (offersContract, userAddress) => {
  try {
    const trx = await offersContract.getOffersByUser(userAddress)
    const result = await trx.wait()
    console.log(result)
    return result
  } catch (e) {
    console.error({ e })
    throw e
  }
}
