import React, { useState, useEffect } from 'react'
import HTMLFlipBook from 'react-pageflip'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Swal from 'sweetalert2'
import {useTranslation} from 'next-i18next'
import { useWeb3Context } from '../../hooks'

import { storageUrlGamma, openSeaUrlGamma } from '../../config'
import { hasCard } from '../../services/contracts/gamma'
import { useLayoutContext } from '../../hooks'
 
const InfoCard = React.forwardRef((props, book) => {
  const { imageNumber } = props
  const {t} = useTranslation()
  const { size, startLoading, stopLoading } = useLayoutContext()
  const { gammaCardsContract } = useWeb3Context()
  const [ userHasCard, setUserHasCard ] = useState(false)

  function emitError (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      showConfirmButton: true,
      timer: 5000
    })
  }
  
  const verifyUserHasCard = async () => {
    console.log('called verify')
    try {
      const result = await hasCard(gammaCardsContract, imageNumber)
      setUserHasCard(result)
    } catch (ex) {
      console.error(ex)
      emitError (t('user_has_card_error'))
    }
  }

  useEffect(() => {
    verifyUserHasCard()
  }, [gammaCardsContract])

  const handleOfferClick = async () => {
    // TODO
  }

  const handlePublishClick = async () => {
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
        //             imageUrl:`${storageUrlGamma}/T1/${props.imageNumber}.png`,
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
        //         // imageUrl:`${storageUrlGamma}/T1/${props.imageNumber}.png`,
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
    })
  }

  const handleTransferClick = async () => {
    Swal.fire({
      text: `${t('wallet_destinatario')}`,
      html: `<h5>${t('wallet_destinatario')}</h5><input type="text" id="quiero" class="swal2-input" placeholder=${t('wallet').toLowerCase()} pattern="[0-9,]+" >`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `${t('trasnferir')}`,
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
        //             imageUrl:`${storageUrlGamma}/T1/${props.imageNumber}.png`,
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
        //         // imageUrl:`${storageUrlGamma}/T1/${props.imageNumber}.png`,
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
    })
    /*
    console.log('click transfer card')
    const modal = document.getElementsByClassName('gamma_transfer_modal')[0]
    modal.setAttribute('class', 'alpha_transfer_modal')
    */
  }

  const handleTransferModalClick = async () => {
    // TODO
  }

  const handleMintClick = async () => {
    try {
      startLoading()
      const transaction = await gammaCardsContract.mintCard(imageNumber)
      transaction.wait()
      stopLoading()
      Swal.fire({
        title: '',
        html: `${t('carta_minteada')} 
        <a target='_blank' href=${openSeaUrlGamma}/${imageNumber}'>
          ${t('aqui')}
        </a>`,
        icon: 'success',
        showConfirmButton: true
      })
      return transaction
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('mint_error'))
    }
  }

  const OfferButton = () => {
    return (
      <div className= {userHasCard ? 'option' : 'option_disabled' }
      onClick={() => handleOfferClick()}
    >
        {t('ofertas')}
      </div>
    )
  }

  const MintButton = () => {
    return (
      <div
        className= {userHasCard ? 'option' : 'option_disabled' }
        onClick={() => handleMintClick()}
      >
        {t('mintear')}
      </div>
    )
  }

  const PublishButton = () => {
    return (
      <div
        className= {userHasCard ? 'option' : 'option_disabled' }
        onClick={() => handlePublishClick()}
      >
        {t('publicar')}
      </div>
    )
  }

  const TransferButton = () => {
    return (
      <div
        className= {userHasCard ? 'option' : 'option_disabled' }
        onClick={() => handleTransferClick()}
      >
        {t('transferir')}
      </div>
    )
  }

  const TrasnferModal = () => {
    return (
      <div className='gamma_transfer_modal gamma_display_none'>
        <button
          className='gamma_transfer_modal_close gamma_modal_close'
          onClick={() => {
            const modal = document.getElementsByClassName(
              'gamma_transfer_modal'
            )[0]
            modal.setAttribute(
              'class',
              'gamma_transfer_modal gamma_display_none'
            )
            // setTransferError('')
            // setReceiverAccount('')
          }}
        >
          X
        </button>
        <span style={{ fontSize: '0.9rem' }}>
          {t('carta_de_coleccion')}{' '}
          {/*cards[cardIndex]
            ? ethers.BigNumber.from(
              cards[cardIndex].collection
            ).toNumber()
            : ethers.BigNumber.from(
              cards[cardIndex - 1].collection
            ).toNumber()*/}
        </span>
        <input
          placeholder={t('wallet_destinatario')}
          // value={receiverAccount}
          // onChange={(e) => setReceiverAccount(e.target.value)}
        />
        <button
          className='gamma_button'
          onClick={() => handleTransferModalClick()}
          // disabled={disableTransfer}
        >
          {t('transferir')}
        </button>
        {/*<span className='gamma_transfer_error'>{transferError}</span>*/}
      </div>
    )
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
                src={`${storageUrlGamma}/T1/${props.imageNumber}.png`}
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
            <MintButton/>
            <TransferButton/>
            <PublishButton/>
            <OfferButton/>
          </div>
          
          <div className='modals'>
            <TrasnferModal/>
          </div>
        </div>
        {/* {pagination.page2.map((item, index) => {
                        return (
                            <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                <img src={`${storageUrlGamma}/T1/${item}.png`} alt="img" />
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

