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
import { storageUrlAlpha, openSeaUrlAlpha } from '../../config'
import { useTranslation } from 'next-i18next'
import CustomImage from '../../components/CustomImage'

SwiperCore.use([Parallax, Autoplay, Navigation, Pagination, Scrollbar, A11y])

const AlphaAlbums = ({ albums, clickFromAlbums, setSeasonName }) => {
  const { t } = useTranslation()
  const noAlbumMessage = t('juega_para_completar')
  const [seasonNameAlbum, setSeasonNameAlbums] = useState('')

  function handleRedirectAlbum(album) {
    if (album[0].completion === 5) {
      // Open the album on OpenSea if the completion status is 5
      window.open(`${openSeaUrlAlpha}/${album[0].tokenId}`, '_blank')
    } else {
      // Otherwise, display a message to the user and perform some actions
      setSeasonName(album[0].season)
      clickFromAlbums()
      Swal.fire({
        text: noAlbumMessage,
        timer: 3000
      })
    }
  }

  return (
    <div className='alpha_full_albums_container alpha_display_none'>
      <div>
        {albums && (
          <div>
            <div className='alpha_albums_season'>
              <img alt='alpha-full' src={'/images/common/marco.png'} />
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
              {albums &&
                albums.map((album, index) => (
                  <SwiperSlide key={index} className='swiper-slide' id='alpha-albums-swiper-slide'>
                    <CustomImage
                      alt='portadas'
                      style={{ cursor: 'pointer' }}
                      src={`${storageUrlAlpha}/${album[1] || 'T1'}/${album[0].number}.png`}
                      className='alpha_card'
                      onClick={() => handleRedirectAlbum(album)}
                    />
                  </SwiperSlide>
                ))}
              <div className='pagination' />
            </Swiper>
          </div>
        )}

        {!albums && (
          <div className='alpha_no_album_message' onClick={() => clickFromAlbums()}>
            {noAlbumMessage}
          </div>
        )}
      </div>
    </div>
  )
}

AlphaAlbums.propTypes = {
  albums: PropTypes.object,
  clickFromAlbums: PropTypes.func,
  setSeasonName: PropTypes.func
}

export default AlphaAlbums
