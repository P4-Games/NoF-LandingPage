import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import { useTranslation } from 'next-i18next'
import { MdOutlineLocalOffer } from 'react-icons/md'

import { useWeb3Context } from '../../hooks'
import { storageUrlGamma, openSeaUrlGamma } from '../../config'
import { hasCard } from '../../services/gamma'
import { removeOfferByCardNumber } from '../../services/offers'
import { useLayoutContext } from '../../hooks'
import { checkInputAddress } from '../../utils/InputValidators'
import GammaAlbumPublish from './GammaAlbumPublish'
import { canUserPublishOffer, canAnyUserPublishOffer } from '../../services/offers'
import { emitError, emitInfo, emitSuccess } from '../../utils/alert'
import FlipBook from '../../components/FlipBook'

const GammaCardInfo = (props) => {
  const { t } = useTranslation()
  const {
    loading,
    startLoading,
    stopLoading,
    ToggleShowDefaultButtons,
    updateShowButtons,
    updateFooterButtonsClasses
  } = useLayoutContext()
  const { gammaCardsContract, gammaOffersContract, walletAddress } = useWeb3Context()
  const { handleFinishInfoCard, handleOpenCardOffers, userCard, paginationObj } = props
  const [userHasCard, setUserHasCard] = useState(false)
  const [cardPublish, setCardPublish] = useState(false)

  const verifyUserHasCard = async () => {
    try {
      startLoading()
      const result = await hasCard(gammaCardsContract, walletAddress, userCard.name)
      setUserHasCard(result)
      stopLoading()
    } catch (ex) {
      stopLoading()
      console.error(ex)
      emitError(t('user_has_card_error'))
    }
  }

  useEffect(() => {
    ToggleShowDefaultButtons(true)
    updateShowButtons([true, true, true, true])
    updateFooterButtonsClasses([null, null, null, null])
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    verifyUserHasCard()
  }, [gammaCardsContract]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleOfferClick = async () => {
    handleOpenCardOffers()
  }

  const handleFinishPublish = (update) => {
    setCardPublish(false)
    if (update) {
      handleFinishInfoCard(update)
    }
  }

  const handleUnPublishClick = async () => {
    try {
      const result = await Swal.fire({
        text: `${t('unpublish_offer_dialog')}`,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: `${t('despublicar')}`,
        confirmButtonColor: '#005EA3',
        color: 'black',
        background: 'white',
        customClass: {
          image: 'cardalertimg'
        }
      })

      if (result.isConfirmed) {
        startLoading()
        await removeOfferByCardNumber(gammaOffersContract, userCard.name)
        handleFinishInfoCard(true)
        stopLoading()
        emitSuccess(t('confirmado'), 2000)
      }
    } catch (ex) {
      stopLoading()
      console.error(ex.message)
      emitError(t('unpublish_offer_error'))
    }
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
          if (!checkInputAddress(value, walletAddress)) return `${t('direccion_destino_error')}`
        },
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: `${t('transferir')}`,
        confirmButtonColor: '#005EA3',
        color: 'black',
        background: 'white',
        customClass: {
          image: 'cardalertimg',
          input: 'alertinput gamma_validators_centered_input'
        }
      })

      if (result.isConfirmed) {
        startLoading()
        const transaction = await gammaCardsContract.transferCard(result.value, userCard.name)
        await transaction.wait()
        handleFinishInfoCard(true)
        stopLoading()
        emitSuccess(t('confirmado'), 2000)
      }
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('transfer_card_error'))
    }
  }

  const handleMintClick = async () => {
    try {
      startLoading()
      const transaction = await gammaCardsContract.mintCard(userCard.name)
      await transaction.wait()
      handleFinishInfoCard(true)
      stopLoading()
      Swal.fire({
        title: '',
        html: `${t('carta_minteada')} 
        <a target='_blank' href=${openSeaUrlGamma}/${userCard.name}'>
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

  const handlePublishClick = async () => {
    startLoading()

    const canUserPublishResult = await canUserPublishOffer(gammaOffersContract, walletAddress)
    if (!canUserPublishResult) {
      emitInfo(t('offer_user_limit'), 7000)
    } else {
      const canAnyUserPublishResult = await canAnyUserPublishOffer(gammaOffersContract)
      if (!canAnyUserPublishResult) {
        emitInfo(t('offer_game_limit'), 7000)
      } else {
        setCardPublish(true)
      }
    }
    stopLoading()
  }

  const OfferButton = () => (
    <div className={'option'} onClick={() => handleOfferClick()}>
      {t('ofertas')}
    </div>
  )

  const MintButton = () => (
    <div
      /* Solo se puede tener una oferta para una carta, por lo que si tengo quantity > 1,
       tengo que poder mintear la otra carta que tenga.*/
      className={
        userHasCard && (!userCard.offered || userCard.quantity > 1) ? 'option' : 'option_disabled'
      }
      onClick={() => handleMintClick()}
    >
      {t('mintear')}
    </div>
  )

  const PublishButton = () => (
    <div
      className={userHasCard ? 'option' : 'option_disabled'}
      onClick={() => handlePublishClick()}
    >
      {t('publicar')}
    </div>
  )

  const UnPublishButton = () => (
    <div
      className={userCard.offered ? 'option' : 'option_disabled'}
      onClick={() => handleUnPublishClick()}
    >
      {t('despublicar')}
    </div>
  )

  const TransferButton = () => (
    <div
      /* Solo se puede tener una oferta para una carta, por lo que si tengo quantity > 1,
         tengo que poder mintear la otra carta que tenga.*/
      className={
        userHasCard && (!userCard.offered || userCard.quantity > 1) ? 'option' : 'option_disabled'
      }
      onClick={() => handleTransferClick()}
    >
      {t('transferir')}
    </div>
  )

  const handleCloseButtonClick = () => {
    handleFinishInfoCard(false)
  }

  const Page1 = () => (
    <div className='cardinfo'>
      <div className='cardinfoimg'>
        <img src={`${storageUrlGamma}/T1/${userCard.name}.png`} alt='img' />
        {userCard.offered && <MdOutlineLocalOffer className='cardinfoimg-offered' />}
      </div>
      <h3>#{userCard.name}</h3>
      <div className='cardnof' />
    </div>
  )

  const Page2 = () => (
    <div className='cardinfo'>
      <div className='transactions'>
        <MintButton />
        <TransferButton />
        {!userCard.offered && <PublishButton />}
        {userCard.offered && <UnPublishButton />}
        <OfferButton />
      </div>
    </div>
  )

  const BookCard = () => (
    <FlipBook
      showClose={true}
      onCloseClick={handleCloseButtonClick}
      pages={[<Page1 key={'page-1'} />, <Page2 key={'page-2'} />]}
    />
  )

  return loading ? (
    <></>
  ) : (
    <>
      {!cardPublish && <BookCard />}
      {cardPublish && (
        <GammaAlbumPublish
          paginationObj={paginationObj}
          cardNumberOffered={userCard.name}
          handleFinishPublish={handleFinishPublish}
        />
      )}
    </>
  )
}

GammaCardInfo.propTypes = {
  userCard: PropTypes.object,
  paginationObj: PropTypes.object,
  handleOpenCardOffers: PropTypes.func,
  handleFinishInfoCard: PropTypes.func
}

export default GammaCardInfo
