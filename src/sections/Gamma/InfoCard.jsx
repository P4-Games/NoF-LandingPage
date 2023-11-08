import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import HTMLFlipBook from 'react-pageflip'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Swal from 'sweetalert2'
import {useTranslation} from 'next-i18next'

const InfoCard = React.forwardRef((props, book) => {
  const {t} = useTranslation()
  const [size, setSize] = useState(false)

  useEffect(() => {
    if (window.innerWidth < 600) {
      setSize(true)
    } else {
      setSize(false)
    }
    const updateMedia = () => {
      if (window.innerWidth < 600) {
        setSize(true)
      } else {
        setSize(false)
      }
    }
    window.addEventListener('resize', updateMedia)
    return () => window.removeEventListener('resize', updateMedia)
  }, [])

  const mint = async () => {
    const { imageNumber, cardsContract, setLoading } = props
    try {
      const transaction = await cardsContract.mintCard(imageNumber)
      setLoading(true)
      transaction.wait()
      setLoading(false)
      Swal.fire({
        title: '',
        text: `${t('carta_minteada')} ${(
          <a href='https://testnets.opensea.io/assets/mumbai/${cardsContract.address}/${imageNumber}'>
            ${t('aqui')}
          </a>
        )}`,
        icon: 'success',
        showConfirmButton: true
      })
      return transaction
    } catch (e) {
      console.error({ e })
    }
  }

  mint.propTypes = {
    imageNumber: PropTypes.number,
    cardsContract: PropTypes.object,
    setLoading: PropTypes.func
  }

  return (
    <HTMLFlipBook
      id='Book'
      size='stretch'
      width={360}
      height={500}
      minWidth={300}
      maxWidth={800}
      minHeight={350}
      maxHeight={800}
      autoSize
      drawShadow={false}
      usePortrait={size}
      ref={book}
      className='hero__top__album__book'
    >
      <div
        className='hero__top__album__book__page'
        data-density='hard'
        number='1'
      >
        <div className='hero__top__album__book__page__page-content'>
          <div className='cardinfo'>
            <div className='cardinfoimg'>
              <img
                src={`https://storage.googleapis.com/nof-gamma/T1/${props.imageNumber}.png`}
                alt='img'
              />
            </div>
            <h3>#{props.imageNumber}</h3>
            <div className='cardnof' />
          </div>
        </div>
      </div>
      <div
        className='hero__top__album__book__page0'
        data-density='hard'
        number='2'
      >
        <div className='cardinfo'>
          <div className='transactions'>
            <div className='option' onClick={() => mint()}>
              {t('mintear')}
            </div>
            <div className='option2'>{t('ofertas')}</div>
            <div
              onClick={() =>
                Swal.fire({
                  text: `${t('cartas_a_cambio')}`,
                  html: `<h3>${t('cartas_a_cambio')}</h3><input type="text" id="quiero" class="swal2-input" placeholder=${t('cards').toLowerCase()} pattern="[0-9,]+" >`,
                  showDenyButton: false,
                  showCancelButton: true,
                  confirmButtonText: `${t('publicar')}`,
                  confirmButtonColor: '#005EA3',
                  color: 'black',
                  background: 'white',
                  customClass: {
                    image: 'cardalertimg',
                    input: 'alertinput'
                    // container: 'cardcontainer',
                    // confirmButton: 'alertbuttonvender',
                    // cancelButton: 'alertcancelbutton',
                  }
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    // const input = Swal.getPopup().querySelector('#quiero')
                    // setWantedCards(input.value)
                    Swal.fire({
                      title: '',
                      text: t('confirmado'),
                      icon: 'success',
                      showConfirmButton: false,
                      timer: 1500
                    })
                    //     Swal.fire({
                    //         text: 'Publicar?',
                    //         showCancelButton: true,
                    //         confirmButtonText: 'Confirmar publicacion',
                    //         showLoaderOnConfirm: true,
                    //         preConfirm: (login) => {
                    //           return fetch(`//api.github.com/users/${login}`)
                    //             .then(response => {
                    //               if (!response.ok) {
                    //                 throw new Error(response.statusText)
                    //               }
                    //               return response.json()
                    //             })
                    //             .catch(error => {
                    //               Swal.showValidationMessage(
                    //                 `Request failed: ${error}`
                    //               )
                    //             })
                    //         },
                    //         allowOutsideClick: () => !Swal.isLoading()
                    //       }).then((result) => {
                    //         if (result.isConfirmed) {
                    //           Swal.fire({
                    //             text: `El precio elegido es ${result.value.login}`,
                    //             imageUrl:`https://storage.googleapis.com/nof-gamma/T1/${props.imageNumber}.png`,
                    //             color:`whitesmoke`,
                    //             backdrop:"#0000009e",
                    //             customClass: {
                    //                 image: 'cardalertimg',
                    //                 input: 'alertinput',
                    //                 // container: 'cardcontainer',
                    //                 popup: 'cardcontainer',
                    //                 confirmButton: 'alertbuttonvender',
                    //                 cancelButton: 'alertcancelbutton',
                    //             },
                    //           })
                    //         }
                    //       })
                    // } else if (result.isDenied) {
                    //     Swal.fire({
                    //         text: `Selecciona la carta que te gustaria intercambiar por la tuya`,
                    //         // imageUrl:`https://storage.googleapis.com/nof-gamma/T1/${props.imageNumber}.png`,
                    //         color:`black`,
                    //         backdrop:"#0000009e",
                    //         customClass: {
                    //             image: 'cardalertimg',
                    //             input: 'alertinput',
                    //             // container: 'cardcontainer',
                    //             popup: 'cardspopup',
                    //             confirmButton: 'okbutton',
                    //             cancelButton: 'alertcancelbutton',
                    //         },
                    //       })
                  }
                })}
              className='option3'
            >
              {t('publicar')}
            </div>
          </div>
        </div>
        {/* {pagination.page2.map((item, index) => {
                        return (
                            <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                {pagination.fakeUser[item].stamped && <FcCheckmark />}
                                <div className='number'>{pagination.fakeUser[item].name}</div>
                                {pagination.fakeUser[item].quantity != 0 && pagination.fakeUser[item].quantity != 1
                                    &&
                                    <div className='quantity'>X:{pagination.fakeUser[item].quantity}</div>
                                }
                            </div>
                        )
                    })} */}
      </div>
    </HTMLFlipBook>
  )
})



export default InfoCard
