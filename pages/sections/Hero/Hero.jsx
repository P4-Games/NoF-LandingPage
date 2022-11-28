import React from 'react'
import Image from 'next/image'
import HTMLFlipBook from 'react-pageflip'
import Noficon from './background/logo-nof.gif'
import Bookmenu from './background/book-menu-1.png'
import Gold from './background/oro.png'
import Plate from './background/plata.png'
import Bronce from './background/bronce.png'
import N from './background/n.png'
import O from './background/o.png'
import F from './background/f.png'
import Albumfirst from './background/album3.png'
import Albumsecond from './background/album6.png'
import Albumthird from './background/album12.png'
import Profiles from './Profiles.json'
import Friends from './Friends.json'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards, Autoplay, Pagination } from 'swiper'
import 'swiper/css/bundle'

const Hero = React.forwardRef((props, book) => {
  return (
    <div className='hero' id='Hero'>
      <div className='hero__top'>
        <div className='hero__top__nof'>
          <Image
            src={Noficon}
            alt='text box'
            width={210}
            height={380}
            layout='responsive'
          />
        </div>
        <div className='hero__top__album'>
          <HTMLFlipBook
            id='Book'
            size='stretch'
            width={360}
            height={500}
            minWidth={215}
            maxWidth={800}
            minHeight={150}
            maxHeight={800}
            ref={book}
            autoSize
            drawShadow={false}
            changeOrientation='portrait'
            className='hero__top__album__book'
            mobileScrollSupport
          >
            <div className='hero__top__album__book__page' data-density='hard'>
              <h3>BIENVENIDOS!</h3>
              <br />
              <Image
                src={Bookmenu}
                alt='text box'
                width={350}
                height={100}
              />
              <br /><br />
              <p>Number one es el primer<br />
                collect-to-earn del mundo,<br />
                donde los jugadores<br />
                obtienen recompensas<br />
                mientras crean su propia<br />
                colección de álbumes NFT.
              </p>
            </div>

            <div className='hero__top__album__book__page0' data-density='hard'>
              <p> <br />
                Nuestro objetivo es<br />
                convertirnos en el mayor<br />
                punto de encuentro<br />
                de los grupos de fans, donde<br />
                podrán revivir la afición<br />
                de coleccionar figutitas.
              </p>
              <div>
                <Image
                  src={Gold}
                  alt='text box'
                  width={80}
                  height={80}
                />
                <Image
                  src={Plate}
                  alt='text box'
                  width={80}
                  height={80}
                />
                <Image
                  src={Bronce}
                  alt='text box'
                  width={80}
                  height={80}
                />
              </div>
              <p>
                Buscamos desarrollar<br />
                un juego sostenible y<br />
                al mismo tiempo crear<br />
                la mayor enciclopedia<br />
                gráfica de personajes<br />
                pixelart de la historia.
              </p>
            </div>

            <div className='hero__top__album__book__page' data-density='hard'>
              <h3>CARTAS</h3>
              <br />
              <p>
                Nuestras cartas representan<br />
                a los personajes más famosos.<br />
                Cada personaje cuenta con<br />
                tres rarezas:<br />
              </p>
              <div className='hero__top__album__book__page__nof'>
                <p id='cardstext'>
                  <Image
                    src={N}
                    alt='N image'
                    width={40}
                    height={40}
                  />
                  Una carta de Oro<br />
                  <Image
                    src={O}
                    alt='O image'
                    width={40}
                    height={40}
                  />
                  Dos cartas de Plata<br />
                  <Image
                    src={F}
                    alt='F image'
                    width={40}
                    height={40}
                  />
                  Tres cartas de Bronce<br />
                </p>
              </div>
              <br />
              <p>
                Todos nuestros NFTs<br />
                pueden ser intercambiados<br />
                de manera libre!.<br />
              </p>
            </div>
            <div className='hero__top__album__book__page0' data-density='hard'>
              <h3>ÁLBUMES</h3>
              <p>
                Gana dinero completando<br />
                álbumes.<br />
                Existen 3 tipos de álbumes<br />
                con distinas mecánicas jugables.<br />
              </p>
              <div className='albums_container'>
                <div className='album1'>
                  <div className='albumtitle'>
                    <p>
                      MEDAL: Define tu nivel
                      de coleccionista.
                    </p>
                  </div>
                  <div className='albumimg'>
                    <Image alt='imagenalbum'
                      src={Albumfirst}
                      layout='fill' />
                  </div>
                </div>
                <div className='album2'>
                  <div className='albumtitle'>
                    <p>
                      STICKER: tu premio asegurado
                      Mayor rareza mejor recompensa
                    </p>
                  </div>
                  <div className='albumimg'>
                    <Image alt='imagenalbum'
                      src={Albumsecond}
                      layout='fill' />
                  </div>
                </div>
                <div className='album3'>
                  <div className='albumtitle'>
                    <p>
                      SHOWDOWN: Concurso de popularidad,
                      quien es el mas famoso!
                    </p>
                  </div>
                  <div className='albumimg'>
                    <Image alt='imagenalbum'
                      src={Albumthird}
                      layout='fill' />
                  </div>
                </div>

              </div>
            </div>
            <div className='hero__top__album__book__page' data-density='hard'>
              <h3>COLECCIÓN</h3>
              <p>
                ALPHA: Juega y colecciona con<br />
                tus amigos, se el primero en<br />
                completar el álbum y obtener<br />
                los mejores premios.<br />
              </p>
              <p>
                GAMMA: colecciona tus personajes<br />
                favoritos e
                intercámbialos en la<br />
                NoF town.<br />
                <br />
              </p>
              <p>
                OMEGA: El primer collect-to-earn.<br />
                Donde a medida que creas<br />
                tu colección<br />
                Obtienes recompensas.<br />
              </p>
            </div>

            <div className='hero__top__album__book__page0' data-density='hard'>
              <h3>ECOSISTEMA</h3>
              <p>
                La economía de NoF está<br />
                regulada por sus<br />
                temporadas y los álbumes<br />
                con distinas mecánicas jugables.<br />
                <br />
                En cada temporada se<br />
                emiten nuevos personajes<br />
                y álbumes de cada tipo.
              </p>
              <Image
                src={Gold}
                alt='text box'
                width={80}
                height={80}
              />
              <p>
                Nuestro objetivo es:<br />
                Crear un juego sano,<br />
                divertido y disruptivo.
              </p>
            </div>
            <div className='hero__top__album__book__page' data-density='hard'>
              <div className='hero__top__album__book__page__profiles'>
                <h3 className='hero__top__album__book__page__profiles__title'>EQUIPO</h3>
                <div className='hero__top__album__book__page__profiles__content'>
                  {
                    Profiles && Profiles.map(profile => {
                      return (
                        <div className='hero__top__album__book__page__profiles__box' key={profile.id}>
                          <Image
                            width={60}
                            height={60}
                            src={profile.icon}
                          />

                          <p>{profile.caption}</p>
                          <p>{profile.position}</p></div>

                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div className='hero__top__album__book__page0' data-density='hard'>
              <h3>AMIGOS</h3>
              <div className='hero__top__album__book__page__profiles'>
                {
                  Friends && Friends.map(friend => {
                    return (
                      <div className='hero__top __album__book__page0__friends__box' key={friend.id}>
                        <Image
                          width={80}
                          height={80}
                          src={friend.icon}
                        />
                        <br />
                        {friend.caption}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </HTMLFlipBook>
        </div>
        <div className='hero__top__swiper'>
          <>
            <Swiper
              effect='cards'
              grabCursor
              modules={[EffectCards, Autoplay, Pagination]}
              loop
              autoplay={{
                delay: 3000,
                disableOnInteraction: false
              }}
              pagination={{
                el: '.pagination',
                clickable: true
              }}
              className='hero__top__swiper__slide'
            >
              <SwiperSlide />
              <SwiperSlide />
              <SwiperSlide />
              <SwiperSlide />
              <SwiperSlide />
              <SwiperSlide />
              <SwiperSlide />
              <SwiperSlide />
              <SwiperSlide />
            </Swiper>
            <div className='pagination' />
          </>
        </div>
      </div>
    </div>
  )
}
)

export default Hero
