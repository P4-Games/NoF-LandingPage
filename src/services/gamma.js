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

export const getCardsByUser = async (cardsContract, walletAddress) => {
  try {
    if (!cardsContract) return
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

    console.log('userCards', cardsObj)
    return cardsObj
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const hasCard = async (cardsContract, cardNumber) => {
  try {
    const result = await cardsContract.hasCard(cardNumber)
    return result
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const getPackPrice = async (cardsContract) => {
  try {
    const price = await cardsContract.packPrice()
    const result = ethers.utils.formatUnits(price, 18)
    return result
  } catch (e) {
    console.error({ e })
    throw e
  }
}

export const finishAlbum = async (cardsContract, walletAddress) => {
  try {
    const result = await allowedToFinishAlbum(cardsContract, walletAddress)
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

export const allowedToFinishAlbum = async (cardsContract, walletAddress) => {
  // Hay 3 condicione sen el contrato para poder completarlo:
  // 1. Que el usuario tengan un álbum: require(cardsByUser[msg.sender][120] > 0, "No tienes ningun album");
  // 2. Que haya un balance mayor a lo que se paga de premio: require(prizesBalance >= mainAlbumPrize, "Fondos insuficientes");
  // 3. Que el usuario tenga todas las cartas.
  // Las 3 se validan en el contrato. La 1 y 2 también se validan aquí. La 3 es una condición requerida para llegar
  // hasta ésta función, por lo que también es validada en el index.

  // require(cardsByUser[msg.sender][120] > 0, "No tienes ningun album");
  const userHasAlbum = await cardsContract.cardsByUser(walletAddress, 120)

  const prizesBalance = await cardsContract.prizesBalance()
  const mainAlbumPrize = await cardsContract.mainAlbumPrize()
  const prizeBalance = ethers.utils.formatUnits(prizesBalance, 18)
  const albumPrize = ethers.utils.formatUnits(mainAlbumPrize, 18)

  // require(prizesBalance >= mainAlbumPrize, "Fondos insuficientes");
  const prizesBalanzGTAlbumPrice = parseInt(prizeBalance) >= parseInt(albumPrize)
  const result = userHasAlbum && prizesBalanzGTAlbumPrice

  console.log(
    'prizesBalanzGTAlbumPrice',
    userHasAlbum,
    prizeBalance,
    albumPrize,
    prizesBalanzGTAlbumPrice,
    result
  )

  return result
}