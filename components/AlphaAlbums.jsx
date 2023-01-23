import { useState, useEffect } from 'react'

const AlphaAlbums = ({ seasonNames, address }) => {

  const getAlbums = async () => {
    let albums = []
    for(let i=0;i<seasonNames.length;i++){
      const album = await nofContract.getCardsByUserBySeason(address, seasonNames[i])
    }
  }

  return (
    <div className='alpha_inner_container'></div>
  )
}

export default AlphaAlbums;