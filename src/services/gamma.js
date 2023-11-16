import { ethers } from 'ethers'
import { gammaServiceUrl } from '../config'

export const fetchPackData = async (walletAddress, pack_number) => {
  // llamada a la api para que nos de la data a pasar en la llamada al contrato
  try {
    const body = {
      address: walletAddress, // user address
      packet_number: pack_number // numero de paquete que se esta abriendo
    }
    console.log('gamma micro service body', body)
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

export const getCardsByUser = async (cardsContract, walletAddress, pagination) => {
  try {
    // console.log('cardsContract', cardsContract, walletAddress)
    if (!cardsContract) return
    const cardsArr = await cardsContract?.getCardsByUser(walletAddress)
    // console.log('cardsArr', cardsArr)
    const cardsObj = pagination
    // console.log('cardsObj', cardsObj)
    if (cardsArr && cardsArr.length > 0) {
      for (let i = 0; i < cardsArr[0]?.length; i++) {
        //console.log(cardsArr[1][i])
        cardsObj.user[cardsArr[0][i]].stamped = true
        cardsObj.user[cardsArr[0][i]].quantity = cardsArr[1][i]
      }
    }
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


export const finishAlbum = async (cardsContract) => {
  try {
    await cardsContract.finishAlbum()
    await openPackTx.wait()
  } catch (e) {
    console.error({ e })
    throw e
  }
}

