import { ethers } from 'ethers'
import { useState, useEffect } from 'react'

const AlphaAlbums = ({ nofContract, seasonNames, account }) => {

  const getAlbums = async () => {
    let albums = []
    for(let i=0;i<seasonNames.length;i++){
      const album = await nofContract.getCardsByUserBySeason(account, seasonNames[i])
      for(let j=0;j<album.length;j++){
        if(album[j].class == 0 && album[j].completion == 1){
          albums.push([album[j].season, album[j].number])
        }
      }
    }
    return albums
  }

  const handleClick = () => {
    getAlbums()
      .then(albums => console.log({ albums }))
      .catch(e => console.error({ e }))
  }

  return (
    <div className='alpha_full_albums_container'>
      <button onClick={() => handleClick()}>CLICK FOR ALBUMS</button>
    </div>
  )
}

export default AlphaAlbums;