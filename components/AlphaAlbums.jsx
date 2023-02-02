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
    marco,
    production,
    contractAddress
  }) => {

  
  const openSeaUrl = production ? `https://.opensea.io/assets/matic/${contractAddress}/` : `https://testnets.opensea.io/assets/mumbai/${contractAddress}/`
  const [albums, setAlbums] = useState(null);
  const [noAlbumMessage, setNoAlbumMessage] = useState("")
  const [seasonName, setSeasonName] = useState("")

  const getAlbums = async () => {
    let albumsArr = [];
    for (let i = 0; i < seasonNames.length; i++) {
      const album = await nofContract.getCardsByUserBySeason(
        account,
        seasonNames[i]
      );
      for (let j = 0; j < album.length; j++) {
        if (album[j].class == 0 && album[j].completion == 1) {
          const folder = await getSeasonFolder(album[j].season);
          albumsArr.push([album[j], folder]);
        }
      }
    }
    return albumsArr;
  };

  const handleClick = () => {
    getAlbums()
      .then((albums) => {
        if(albums.length > 0){
          setAlbums(albums);
        } else {
          setNoAlbumMessage('Juega para completar tu primer album!')
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
        {albums ? (
          <div>
            <div className="alpha_albums_season">
              <img src={marco.src}/>
              <span className="alpha_albums_season_name">{seasonName ? seasonName : "Number One Fan"}</span>
            </div>
            <Swiper
            effect="cards"
            grabCursor
            onSlideChange={(res) => {
              return setSeasonName(albums[res.activeIndex][0].season)
            }}
            onInit={(res) => {
              return setSeasonName(albums[res.activeIndex][0].season)
            }}
            modules={[EffectCards, Autoplay, Pagination]}
            pagination={{
              el: ".pagination",
              clickable: true,
            }}
            cardsEffect={{
              slideShadows: false
            }}
            className="swiper-container alpha_albums_swiper_container"
            id="alpha-albums-swiper-container"
          >
            {albums.map((album, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    className="swiper-slide"
                    id="alpha-albums-swiper-slide"
                  >
                    <a href={`${openSeaUrl}/${album[0].tokenId}`} target="_blank">
                      <img alt="portadas" src={storageUrl + album[1] + "/" + album[0].number + ".png"} className="alpha_card" />
                    </a>
                  </SwiperSlide>
                );
              })}
            <div className="pagination"></div>
          </Swiper>
          </div>
        ) : <div>{noAlbumMessage}</div>}
        
      </div>
    </div>
  );
};

export default AlphaAlbums;
