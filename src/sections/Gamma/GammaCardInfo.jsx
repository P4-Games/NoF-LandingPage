import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import HTMLFlipBook from 'react-pageflip'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Swal from 'sweetalert2'
import {useTranslation} from 'next-i18next'
import { useWeb3Context } from '../../hooks'

import { storageUrlGamma, openSeaUrlGamma } from '../../config'
import { hasCard } from '../../services/gamma'
import { useLayoutContext } from '../../hooks'
import { checkInputAddress } from '../../utils/addresses'
 
const GammaCardInfo = React.forwardRef((props, book) => {
  const { imageNumber, handleFinishInfoCard } = props
  const {t} = useTranslation()
  const { size, startLoading, stopLoading } = useLayoutContext()
  const { gammaCardsContract,walletAddress } = useWeb3Context()
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
  }, [gammaCardsContract]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOfferClick = async () => {
    // TODO
  }

  const handlePublishClick = async () => {
    Swal.fire({
      text: `${t('cartas_a_cambio')}`,
      html: `
        <h3>${t('cartas_a_cambio')}</h3><input type="text" id="quiero" class="swal2-input" 
        placeholder=${t('cards').toLowerCase()} pattern="[0-9,]+" >`,
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
          timer: 2000
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
    try {
      const result = await Swal.fire({
        text: `${t('wallet_destinatario')}`,
        input: 'text',
        inputAttributes: {
          min: 43,
          max: 43
        },
        inputValidator: (value) => {
          if (!checkInputAddress(value, walletAddress))
            return `${t('direccion_destino_error')}`
        },
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: `${t('trasnferir')}`,
        confirmButtonColor: '#005EA3',
        color: 'black',
        background: 'white',
        customClass: {
          image: 'cardalertimg',
          input: 'alertinput'
        }
      })

      if (result.isConfirmed) {
        startLoading()
        const transaction = await gammaCardsContract.transferCard(result.value, imageNumber)
        await transaction.wait()
        handleFinishInfoCard()
        stopLoading()
        Swal.fire({
          title: '',
          text: t('confirmado'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        })
      }
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('transfer_card_error'))
    }
  }

  const handleTransferModalClick = async () => {
    // TODO
  }

  const handleMintClick = async () => {
    try {
      startLoading()
      const transaction = await gammaCardsContract.mintCard(imageNumber)
      await transaction.wait()
      handleFinishInfoCard()
      stopLoading()
      Swal.fire({
        title: '',
        html: `${t('carta_minteada')} 
        <a target='_blank' href=${openSeaUrlGamma}/${imageNumber}'>
          ${t('aqui')}
        </a>`,
        icon: 'success',
        showConfirmButton: true,
        timer: 3000
      })
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('mint_error'))
    }
  }

  const OfferButton = () => (
      <div className= {userHasCard ? 'option' : 'option_disabled' }
      onClick={() => handleOfferClick()}
    >
        {t('ofertas')}
      </div>
    )

  const MintButton = () => (
      <div
        className= {userHasCard ? 'option' : 'option_disabled' }
        onClick={() => handleMintClick()}
      >
        {t('mintear')}
      </div>
    )

  const PublishButton = () => (
      <div
        className= {userHasCard ? 'option' : 'option_disabled' }
        onClick={() => handlePublishClick()}
      >
        {t('publicar')}
      </div>
    )

  const TransferButton = () => (
      <div
        className= {userHasCard ? 'option' : 'option_disabled' }
        onClick={() => handleTransferClick()}
      >
        {t('transferir')}
      </div>
    )

  const TrasnferModal = () => (
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
      </div>
    </HTMLFlipBook>
  )
})

GammaCardInfo.propTypes = {
  imageNumber: PropTypes.number,
  handleFinishInfoCard: PropTypes.func
}

export default GammaCardInfo

