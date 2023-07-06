export const checkPacksByUser = async (account, packsContract) => {
  try {
    const packs = await packsContract?.getPacksByUser(account);
    return packs;
  } catch (e) {
    console.error({ e })
  }
}

export const openPack = async (cardsContract, packNumber, packData, signature) => {
  try {
    const openPackTx = await cardsContract.openPack(packNumber, packData, signature);
    await openPackTx.wait()
    return openPackTx
  } catch(e) {
    console.error({ e })
  }
}