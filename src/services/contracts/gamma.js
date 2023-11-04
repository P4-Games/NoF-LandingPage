import { ethers } from 'ethers'

export const checkPacksByUser = async (account, packsContract) => {
  try {
    const packs = await packsContract?.getPacksByUser(account);
    return packs;
  } catch (e) {
    console.error({ e });
  }
};

export const openPack = async (cardsContract, packNumber, packData, signature) => {
  try {
    const openPackTx = await cardsContract.openPack(packNumber, packData, signature);
    await openPackTx.wait();
    return openPackTx;
  } catch (e) {
    console.error({ e });
  }
};

export const getUserCards = async (cardsContract, account, pagination) => {
  try {
    const cardsArr = await cardsContract?.getCardsByUser(account);
    const cardsObj = pagination;
    if (cardsArr?.length > 0) {
      for (let i = 0; i < cardsArr[0]?.length; i++) {
        cardsObj.user[cardsArr[0][i]].stamped = true;
        cardsObj.user[cardsArr[0][i]].quantity = cardsArr[1][i];
      }
    }
    return cardsObj;
  } catch (e) {
    console.error({ e });
  }
};


export const getPackPrice = async (cardsContract) => {
  try {
    const price = await cardsContract.packPrice()
    const result = ethers.utils.formatUnits(price, 18)
    return result
  } catch (e) {
    console.error({ e });
  }
};