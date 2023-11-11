import { ethers } from 'ethers'

export const checkPacksByUser = async (account, packsContract) => {
  try {
    const packs = await packsContract?.getPacksByUser(account)
    return packs
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

export const getCardsByUser = async (cardsContract, account, pagination) => {
  try {
    console.log('cardsContract', cardsContract, account)
    const cardsArr = await cardsContract?.getCardsByUser(account)
    console.log('cardsArr', cardsArr)
    const cardsObj = pagination
    console.log('cardsObj', cardsObj)
    if (cardsArr && cardsArr.length > 0) {
      for (let i = 0; i < cardsArr[0]?.length; i++) {
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
