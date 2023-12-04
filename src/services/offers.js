import { v4 as uuidv4 } from 'uuid'

export const createOffer = async (offersContract, cardNumber, wantedCardNumbers) => {
  for (const wantedCard of wantedCardNumbers) {
    if (wantedCard === cardNumber) {
      throw new Error('publish_offer_error_own_card_number')
    }
  }
  const trx = await offersContract.createOffer(uuidv4(), cardNumber, wantedCardNumbers)
  await trx.wait()
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

export const canUserPublishOffer = async (offersContract, walletAddress) => {
  try {
    const result = await offersContract.canUserPublishOffer(walletAddress)
    return result
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const canAnyUserPublishOffer = async (offersContract) => {
  try {
    const result = await offersContract.canAnyUserPublishOffer()
    return result
  } catch (e) {
    console.error({ e })
    throw e
  }
}

/*
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
*/

export const getOffersByCardNumber = async (offersContract, cardNumber) => {
  try {
    if (!offersContract) return

    // [0][0] offerId, [0][1] cardNumber, [0][2] wantedCards, [0][3] wallet que ofertó
    // [0][4] timeStamp
    const offers = await offersContract.getOffersByCardNumber(cardNumber)
    if (!offers) return []

    const offerObject = offers.map((item) => ({
      offerId: item[0],
      offerCard: parseInt(item[1]),
      wantedCards: item[2],
      offerWallet: item[3],
      timeStamp: item[4]
    }))

    // El contrato puede devolver una oferta vacia en lugar de null,
    // por lo que quedará el offerId en 0
    const filteredResult = offerObject.filter((item) => item.offerId !== 0)
    return filteredResult
  } catch (e) {
    console.error({ e })
    throw e
  }
}

/*
export const deleteUserOffers = async (offersContract, userAddress) => {
  try {
    const offers = await offersContract.getOffersByUser(userAddress)
    if (!offers) return true

    const offerObject = offers.map((item) => ({
      offerId: item[0],
      offerCard: parseInt(item[1]),
      wantedCards: item[2],
      offerWallet: item[3],
      timeStamp: item[4]
    }))

     // El contrato puede devolver una oferta vacia en lugar de null,
    // por lo que quedará el offerId en 0
    const filteredResult = offerObject.filter((item) => item.offerId !== 0)
    // console.log('user offers', offers, filteredResult)

    if (filteredResult && filteredResult.length > 0) {
      for (let index = 0; index < filteredResult.length; index++) {
        const offer = filteredResult[index]
        await offersContract.removeOfferByCardNumber(offer.offerCard)
      }
    }
    return true
  } catch (e) {
    console.error({ e })
    throw e
  }
}
*/
