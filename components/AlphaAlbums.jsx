import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Parallax,
  EffectCards,
} from "swiper";
SwiperCore.use([Parallax, Autoplay, Navigation, Pagination, Scrollbar, A11y]);

const AlphaAlbums = ({
    storageUrl,
    nofContract,
    seasonNames,
    account,
    getSeasonFolder,
  }) => {
  
  const [urls, setUrls] = useState(null);
  const [noAlbumMessage, setNoAlbumMessage] = useState("")

  const getAlbums = async () => {
    let albums = [];
    for (let i = 0; i < seasonNames.length; i++) {
      const album = await nofContract.getCardsByUserBySeason(
        account,
        seasonNames[i]
      );
      for (let j = 0; j < album.length; j++) {
        if (album[j].class == 0 && album[j].completion == 1) {
          albums.push([album[j].season, album[j].number]);
        }
      }
    }
    let urls = [];
    for (let i = 0; i < albums.length; i++) {
      const folder = await getSeasonFolder(albums[i][0]);
      urls.push(storageUrl + folder + "/" + albums[i][1] + ".png");
    }
    return urls;
  };

  const handleClick = () => {
    getAlbums()
      .then((albums) => {
        if(albums.length > 0){
          setUrls(albums);
        } else {
          setNoAlbumMessage('Juega para conseguir tu primer album!')
        }
        const button = document.getElementsByClassName(
          "alpha_albums_button"
        )[0];
        button.style.display = "none";
      })
      .catch((e) => console.error({ e }));
  };

  return (
    <div className="alpha_full_albums_container alpha_display_none">
      <button
        onClick={() => handleClick()}
        className="alpha_button alpha_albums_button"
      >
        CARGAR ALBUMS
      </button>
      <div>
        {urls ? (
          <Swiper
          effect="cards"
          grabCursor
          modules={[EffectCards, Autoplay, Pagination]}
          pagination={{
            el: ".pagination",
            clickable: true,
          }}
          cardsEffect={{
            slideShadows: false
          }}
          className="swiper-container"
          id="alpha-albums-swiper-container"
        >
          {urls.map((url, index) => {
              return (
                <SwiperSlide
                  key={index}
                  className="swiper-slide"
                  id="alpha-albums-swiper-slide"
                >
                  <img alt="portadas" src={url} className="alpha_card" />
                </SwiperSlide>
              );
            })}
          <div className="pagination"></div>
        </Swiper>
        ) : <div>{noAlbumMessage}</div>}
        
      </div>
    </div>
  );
};

export default AlphaAlbums;
