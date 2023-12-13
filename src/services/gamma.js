import { ethers } from 'ethers'
import { gammaServiceUrl } from '../config'
import gammaCardsPages from './gammaCardsPages'

export const fetchPackData = async (walletAddress, pack_number) => {
  // llamada a la api para que nos de la data a pasar en la llamada al contrato
  try {
    const body = {
      address: walletAddress, // user address
      packet_number: pack_number // numero de paquete que se esta abriendo
    }
    const response = await fetch(gammaServiceUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    })
    const data = await response.json()
    return data
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const checkPacksByUser = async (walletAddress, packsContract) => {
  try {
    const packs = await packsContract?.getPacksByUser(walletAddress)
    return packs
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const verifyPackSigner = async (cardsContract, packNumber, packData, signature) => {
  try {
    const signer = await cardsContract.verifyPackSigner(packNumber, packData, signature)
    return signer
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const openPack = async (cardsContract, packNumber, packData, signature) => {
  try {
    const openPackTx = await cardsContract.openPack(packNumber, packData, signature, {
      gasLimit: 6000000
    })
    await openPackTx.wait()
    return openPackTx
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const openPacks = async (
  cardsContract,
  numberOfPacks,
  packsNumber,
  packsData,
  signatures
) => {
  try {
    const openPacksTx = await cardsContract.openPacks(
      numberOfPacks,
      packsNumber,
      packsData,
      signatures,
      {
        gasLimit: 6000000
      }
    )
    await openPacksTx.wait()
    return openPacksTx
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const getMaxPacksAllowedToOpenAtOnce = async (cardsContract) => {
  try {
    const result = await cardsContract.maxPacksToOpenAtOnce()
    return result
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const getCardsByUser = async (cardsContract, walletAddress) => {
  try {
    if (!cardsContract || !walletAddress) return
    const cardData = await cardsContract?.getCardsByUser(walletAddress)
    let cardsObj = { ...gammaCardsPages }

    // Inicializa array
    for (let i = 0; i <= 119; i++) {
      cardsObj.user[i] = {
        name: i.toString(),
        stamped: false,
        offered: false,
        quantity: 0
      }
    }

    // completa array con lo que tiene el usuario
    for (let i = 0; i < cardData[0].length; i++) {
      const cardId = cardData[0][i]
      const quantity = cardData[1][i]
      const offers = cardData[2][i]
      cardsObj.user[cardId] = {
        name: cardId.toString(),
        stamped: quantity > 0,
        offered: offers || false,
        quantity: quantity
      }
    }

    return cardsObj
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const hasCard = async (cardsContract, walletAddress, cardNumber) => {
  try {
    if (!cardsContract || !walletAddress) return
    const result = await cardsContract.hasCard(walletAddress, cardNumber)
    return result
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const getPackPrice = async (cardsContract) => {
  try {
    if (!cardsContract) return
    const price = await cardsContract.packPrice()
    const result = ethers.utils.formatUnits(price, 18)
    return result
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const getUserAlbums120Qtty = async (cardsContract, walletAddress) => {
  try {
    if (!cardsContract || !walletAddress) return
    const userHasAlbum = await cardsContract.cardsByUser(walletAddress, 120)
    return userHasAlbum
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const finishAlbum = async (cardsContract, daiContract, walletAddress) => {
  try {
    if (!cardsContract || !walletAddress) return
    const result = await allowedToFinishAlbum(cardsContract, daiContract, walletAddress)
    if (result) {
      const transaction = await cardsContract.finishAlbum()
      await transaction.wait()
      return true
    } else {
      return false
    }
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const confirmOfferExchange = async (
  offersContract,
  addressFrom,
  cardNumberFrom,
  addressTo,
  cardNumberTo
) => {
  try {
    const transaction = await offersContract.confirmOfferExchange(
      addressFrom,
      cardNumberFrom,
      addressTo,
      cardNumberTo
    )
    await transaction.wait()
    return true
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const allowedToFinishAlbum = async (cardsContract, daiContract, walletAddress) => {
  // Hay 4 condicione sen el contrato para poder completarlo:
  // 1. Que el usuario tengan un álbum: require(cardsByUser[msg.sender][120] > 0, "No tienes ningun album");
  // 2. Que haya un balance mayor a lo que se paga de premio: require(prizesBalance >= mainAlbumPrize, "Fondos insuficientes");
  // 3. Que el usuario tenga todas las cartas.
  // 4. Que el contrato tenga un balance superior al precio del premio (mainAlbumPrize)
  // Las 4 se validan en el contrato y aquí (para evitar la llamada al contrato)

  // require(cardsByUser[msg.sender][120] > 0, "No tienes ningun album");
  if (!cardsContract || !walletAddress) return
  const userHasAlbum = await cardsContract.cardsByUser(walletAddress, 120)
  const prizesBalance = await cardsContract.prizesBalance()
  const mainAlbumPrize = await cardsContract.mainAlbumPrize()
  const gammaContractBalance = await verifyDAIBalance(daiContract, cardsContract.address)
  const prizeBalanceFormatted = ethers.utils.formatUnits(prizesBalance, 18)
  const albumPrizeFormatted = ethers.utils.formatUnits(mainAlbumPrize, 18)
  const gammaContractBalanceFormatted = ethers.utils.formatUnits(gammaContractBalance, 18)

  // require(prizesBalance >= mainAlbumPrize, "Fondos insuficientes");
  const prizesBalanzGTAlbumPrice = parseInt(prizeBalanceFormatted) >= parseInt(albumPrizeFormatted)

  // require gammaCardContractBalance >= mainAlbumPrize
  const contractBalanzGTAlbumPrice =
    parseInt(gammaContractBalanceFormatted) >= parseInt(albumPrizeFormatted)

  const result = userHasAlbum && prizesBalanzGTAlbumPrice && contractBalanzGTAlbumPrice

  console.log('prizesBalanzGTAlbumPrice', {
    userHasAlbum,
    prizeBalanceFormatted,
    albumPrizeFormatted,
    gammaContractBalanceFormatted,
    prizesBalanzGTAlbumPrice,
    contractBalanzGTAlbumPrice,
    result
  })

  return result
}

const verifyDAIBalance = async (daiContract, address) => {
  try {
    const result = await daiContract.balanceOf(address)
    return result
  } catch (e) {
    console.error({ e })
    throw e
  }
}
