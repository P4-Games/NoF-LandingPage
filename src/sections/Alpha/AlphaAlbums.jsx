import PropTypes from 'prop-types'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Parallax,
  EffectCards
} from 'swiper'
import Swal from 'sweetalert2'
import { openSeaUrlAlpha } from '../../config'
import {useTranslation} from 'next-i18next'

SwiperCore.use([Parallax, Autoplay, Navigation, Pagination, Scrollbar, A11y])

const AlphaAlbums = ({
  storageUrlAlpha,
  nofContract,
  seasonNames,
  account,
  getSeasonFolder,
  loadAlbums,
  setSeasonName,
  setLoadAlbums,
  alphaMidButton
}) => {
  const {t} = useTranslation()
  const [albums, setAlbums] = useState(null)
  const [noAlbumMessage, setNoAlbumMessage] = useState('')
  const [seasonNameAlbum, setSeasonNameAlbums] = useState('')

  function handleRedirectAlbum (album) {
    if (album[0].completion === 5) {
      // Open the album on OpenSea if the completion status is 5
      window.open(`${openSeaUrlAlpha}/${album[0].tokenId}`, '_blank')
    } else {
      // Otherwise, display a message to the user and perform some actions
      setSeasonName(album[0].season)
      alphaMidButton()
      setLoadAlbums(false)
      Swal.fire({
        text: 'Tienes que seguir jugando para completar el album',
        timer: 2000
      })
    }
  }

  const getAlbums = async () => {
    const albumsArr = []
    for (let i = 0; i < seasonNames.length; i++) {
      const album = await nofContract.getCardsByUserBySeason(
        account,
        seasonNames[i]
      )
      for (let j = 0; j < album.length; j++) {
        if (album[j].class == 0) {
          const folder = await getSeasonFolder(album[j].season)
          albumsArr.push([album[j], folder])
        }
      }
    }
    return albumsArr
  }

  const handleClick = () => {
    getAlbums()
      .then((albums) => {
        if (albums && albums.length > 0) {
          setAlbums(albums)
        } else {
          setNoAlbumMessage(t('juega_para_completar'))
        }
        const button = document.getElementsByClassName('alpha_albums_button')
        if (button && button.length > 0) {
          button[0].style.display = 'none'  
        }
      })
      .catch((e) => console.error({ e }))
  }
  loadAlbums && handleClick()

  return (
    <div className='alpha_full_albums_container alpha_display_none'>
      <div>
        {albums
          ? (
            <div>
              <div className='alpha_albums_season'>
                <img alt='alpha-full' src={'/marco.png'} />
                <span className='alpha_albums_season_name'>
                  {seasonNameAlbum || 'Number One Fan'}
                </span>
              </div>
              <Swiper
                effect='cards'
                grabCursor
                onSlideChange={(res) => setSeasonNameAlbums(albums[res.activeIndex][0].season)}
                onInit={(res) => setSeasonNameAlbums(albums[res.activeIndex][0].season)}
                modules={[EffectCards, Autoplay, Pagination]}
                pagination={{
                  el: '.pagination',
                  clickable: true
                }}
                cardsEffect={{
                  slideShadows: false
                }}
                className='swiper-container alpha_albums_swiper_container'
                id='alpha-albums-swiper-container'
              >
                {albums.map((album, index) => (
                    <SwiperSlide
                      key={index}
                      className='swiper-slide'
                      id='alpha-albums-swiper-slide'
                    >
                      <img
                        alt='portadas'
                        style={{ cursor: 'pointer' }}
                        src={`${storageUrlAlpha}/${album[1]}/${album[0].number}.png`}
                        className='alpha_card'
                        onClick={() => handleRedirectAlbum(album)}
                      />
                    </SwiperSlide>
                ))}
                <div className='pagination' />
              </Swiper>
            </div>
            )
          : (
            <div>{noAlbumMessage}</div>
            )}
      </div>
    </div>
  )
}

AlphaAlbums.propTypes = {
  storageUrlAlpha: PropTypes.string,
  nofContract: PropTypes.object,
  seasonNames: PropTypes.array,
  account: PropTypes.string,
  getSeasonFolder: PropTypes.func,
  loadAlbums: PropTypes.bool,
  setSeasonName: PropTypes.func,
  setLoadAlbums: PropTypes.func,
  alphaMidButton: PropTypes.func
}


export default AlphaAlbums
