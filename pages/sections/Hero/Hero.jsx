import React, { useCallback, useEffect, useState } from 'react'
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
import Season from './background/temporada.png'
import Albumfirst from './background/album3.png'
import Albumsecond from './background/album6.png'
import Albumthird from './background/album12.png'
import Tech from './background/p4tech.png'
import Profiles from './Profiles.json'
import Friends from './Friends.json'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards, Autoplay, Pagination } from 'swiper'
import 'swiper/css/bundle'
import Link from 'next/link'

const Hero = React.forwardRef((props, book) => {
  const [swipper,setSwipper] =useState(false)
  const [mobile, setMobile] = useState(false);
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()
  const [size, setSize] = useState(false)
  // const width = mobile ? 360 : 360
  // const height = mobile ? 500 : 500
  // const size = mobile ? 'fixed' : 'stretch'
  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobile(true);
      setSize(true)
    } else {
      setMobile(false);
      setSize(false)
    }
    const updateMedia = () => {
      if (window.innerWidth < 600) {
        setMobile(true);
        setSize(true)
      } else {
        setMobile(false);
        setSize(false)
      }
    };
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);
  const onFlip = useCallback((e) => {
    console.log('Current page: ' + e.data);
    if (e.data === 8){
      setSwipper(true)
      return
    }
    setSwipper(false)
    
}, []);
  return (
    <div className='hero' id='Hero'>
      <div className='hero__top'>
        <div className='hero__top__nof'>
          <Image
            src={Noficon}
            alt='Nof-Icon'
            layout='fill'
          />
        </div>
        <div className='hero__top__album'>
          <HTMLFlipBook
            id='Book'
            size={'stretch'}
            width={360}
            height={500}
            minWidth={350}
            maxWidth={800}
            minHeight={500}
            maxHeight={800}
            autoSize={true}
            ref={book}
            onFlip={onFlip}
            usePortrait={size}
            drawShadow={false}
            className='hero__top__album__book'
          >
            <div className='hero__top__album__book__page' data-density='hard'>
              <h3>BIENVENIDOS!</h3>
              <br />
              <div className='nofi_conteiner'>
                <div className='nofimg'>
                  <Image
                    src={Noficon}
                    alt='text box'
                    layout='fill'
                  />
                </div>
              </div>
              <div className='coin_conteiner'>
                <div className='coinimg'>
                  <Image
                    src={Gold}
                    alt='text box'
                    layout='fill'
                  />
                </div>
                <div className='coinimg2'>
                  <Image
                    src={Plate}
                    alt='text box'
                    layout='fill'
                  />
                </div>
                <div className='coinimg3'>
                  <Image
                    src={Bronce}
                    alt='text box'
                    layout='fill'
                  />
                </div>
              </div>
              <br />
              <p className='hero__top__album__book__page__text'>Number One Fan es el primer<br />
                collect-to-earn del mundo,<br />
                donde los jugadores<br />
                obtienen recompensas<br />
                mientras crean su propia<br />
                colección de álbumes NFT.
              </p>
            </div>

            <div className='hero__top__album__book__page0' data-density='hard'>
              <p> <br /><br />
                Nuestro objetivo es<br />
                convertirnos en el mayor<br />
                punto de encuentro<br />
                de los grupos de fans, donde<br />
                podrán revivir la afición<br />
                de coleccionar figuritas.
              </p>
              <div className='book_container'>
                <Image
                  src={Bookmenu}
                  alt='text box'
                  layout='fill'
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
              <p>
                Nuestras cartas representan<br />
                a los personajes más famosos.<br />
                Cada personaje cuenta con<br />
                tres rarezas:<br />
              </p>
              <div className='nof_container'>
                <div className='nof1'>
                  <div className='nofimg'>
                    <Image
                      src={N}
                      alt='N image'
                      layout='fill'
                    />
                  </div>
                  <div className='noftitle'>
                    <p>
                      Una carta de Oro
                    </p>
                  </div>
                </div>

                <div className='nof2'>
                  <div className='nofimg'>
                    <Image
                      src={O}
                      alt='O image'
                      layout='fill'
                    />
                  </div>
                  <div className='noftitle'>
                    <p>Dos cartas de Plata</p>
                  </div>
                </div>

                <div className='nof3'>
                  <div className='nofimg'>
                    <Image
                      src={F}
                      alt='F image'
                      layout='fill'
                    />
                  </div>
                  <div className='noftitle'>
                    <p>
                      Tres cartas de Bronce
                    </p>
                  </div>
                </div>
              </div>
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
                    <Image
                      alt='imagenalbum'
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
              <Link
                href='/Alpha'
              >
                <button className='hero__top__album__book__page__btn'>
                  ALPHA
                </button>
              </Link>
              <p>
                GAMMA: colecciona tus personajes<br />
                favoritos e
                intercámbialos en la<br />
                NoF town.<br />
              </p>
              <Link
                href='https://opensea.io/collection/nof-gamma'
                target='_blank'
                rel='noreferrer'
              >
                <button className='hero__top__album__book__page__btn2'>
                  GAMMA
                </button>
              </Link>
              <p>
                OMEGA: El primer collect-to-earn.<br />
                Donde a medida que creas<br />
                tu colección obtienes recompensas.<br />
              </p>
              <Link
                href='https://opensea.io/collection/nofomega'
                target='_blank'
                rel='noreferrer'
              >
                <button className='hero__top__album__book__page__btn3'>
                  OMEGA
                </button>
              </Link>
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
              <div className='season_container'>
                <div className='seasonimg'>
                  <Image
                    src={Season}
                    alt='text box'
                    layout='fill'
                  />
                </div>
              </div>
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
                          <div className='img'>
                            <Image
                              layout='fill'
                              src={profile.icon}
                            />
                          </div>
                          <p>{profile.caption}
                          <br/>{profile.position}</p>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div className='hero__top__album__book__page0' data-density='hard'>
              <div className='friends_container'>
                <h3 className='title'>AMIGOS</h3>
                <div className='content'>
                  {
                    Friends && Friends.map(friend => {
                      return (
                        <div className='box' key={friend.id}>
                          <div className='img'>
                            <Image
                              layout='fill'
                              src={friend.icon}
                            />
                          </div>
                          <p>{friend.caption}</p>

                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div className='hero__top__album__book__page' data-density='hard'>
              <div className='tech_container'>
                <div className='techimg'>
                  <Image
                    src={Tech}
                    alt='p4tech-solutions'
                    layout='fill'
                  />
                </div>
              </div>
            {!mobile &&  <div className='text-blocker'>
                <h4>
                Number One Fan &<br />
                <br />P4 Tech Solutions <br />
                <br />Copyright © 2022 <br />
                <br />all rights reserved.
                </h4>
              </div>}
              {mobile && <h3 >Mirá nuestros coleccionables!</h3>}
              { mobile && swipper && 
              <div className='hero__top__conteiner__mobile'>
                {swipper && <div className='hero__top__swiper'>
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
                </div>}
              </div>}
            </div>
          </HTMLFlipBook>
        </div>
       {!mobile && <div className='hero__top__conteiner__swiper'>
          <div className='hero__top__swiper'>
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
          </div>
        </div>}
      </div>
    </div >
  )
}
)

export default Hero
