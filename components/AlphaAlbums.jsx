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
        setUrls(albums);
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
      <div className="alpha_cards_container">
        <Swiper
          effect="cards"
          grabCursor
          modules={[EffectCards, Autoplay, Pagination]}
          loop
          pagination={{
            el: ".pagination",
            clickable: true,
          }}
          cardsEffect={{
            slideShadows: false
          }}
          className="swiper-container"
        >
          {urls &&
            urls.map((url, index) => {
              return (
                <SwiperSlide
                  key={index}
                  className="swiper-slide alpha-swiper-slide"
                >
                  <img alt="portadas" src={url} className="alpha_card" />
                </SwiperSlide>
              );
            })}
          <div className="pagination"></div>
        </Swiper>
      </div>
    </div>
  );
};

export default AlphaAlbums;
