import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import Swiper from 'swiper/bundle';

import 'swiper/css/bundle'

let swiper;

const AlphaAlbums = ({ storageUrl, nofContract, seasonNames, account, getSeasonFolder }) => {

  const [urls, setUrls] = useState(null)

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
    let urls = []
    for(let i=0;i<albums.length;i++){
      const folder = await getSeasonFolder(albums[i][0])
      urls.push(storageUrl + folder + "/" + albums[i][1] + ".png")
    }
    return urls
  }

  const handleClick = () => {
    getAlbums()
      .then(albums => {
        setUrls(albums)
        const button = document.getElementsByClassName('alpha_albums_button')[0]
        button.style.display = 'none'
      })
      .catch(e => console.error({ e }))
  }


  useEffect(() => {
    swiper = new Swiper('.swiper-container', {
      effect: 'cards',
      grabCursor: true,
      centeredSlides: true,
      setWrapperSize: true,
      slidesPerView: 1,
      initialSlide: 0,
      runCallbacksOnInit: true,
      observer: true,
      cardsEffect: {
        slideShadows: false,
      },
      pagination: {
        el: '.swiper-pagination',
      },
      on: {
        init: (res) => {
          console.log(res.activeIndex)
          // setCardIndex(res.activeIndex)
          // if(cards.length > 0){
          //   if(cards[res.activeIndex].collection == albumCollection){
          //     setIsCollection(true)
          //   } else {
          //     setIsCollection(false)
          //   }
          // }
        },
        slideChange: (res) => {
          // setCardIndex(res.activeIndex)
          // if(cards[res.activeIndex].collection == albumCollection){
          //   setIsCollection(true)
          // } else {
          //   setIsCollection(false)
          // }    
        },
        observerUpdate: (res) => {
          // setCardIndex(res.activeIndex)
          // if(cards[res.activeIndex].collection == albumCollection){
          //   setIsCollection(true)
          // } else {
          //   setIsCollection(false)
          // }
        },
        slidesLengthChange: (res) => {
          // check function  
        }
      }
    });
  }, [urls])
  
  return (
    <div className='alpha_full_albums_container alpha_display_none'>
      <button onClick={() => handleClick()} className="alpha_button alpha_albums_button">CARGAR ALBUMS</button>
      <div className="alpha_cards_container">
        <div className="swiper-container">
          <div className="swiper-wrapper"></div>
            {urls?.map((url, i) => {
              return(
                <div style={{"backgroundImage":"none", "paddingTop": "0"}} className="swiper-slide" key={Math.floor(Math.random() * 10000)}>
                  <img src={url} alt="number one fan album card" className='alpha_album' />                        
                </div>
              )
            })}
          </div>
        <div className="swiper-pagination swiper-pagination1"></div>
      </div>      
    </div>
  )
}

export default AlphaAlbums;