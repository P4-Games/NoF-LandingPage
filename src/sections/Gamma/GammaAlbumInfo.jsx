import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import { useTranslation } from 'next-i18next'
import { MdOutlineLocalOffer } from 'react-icons/md'

import { storageUrlGamma } from '../../config'
import { hasCard } from '../../services/gamma'
import { checkInputAddress } from '../../utils/InputValidators'
import { emitError, emitSuccess } from '../../utils/alert'
import FlipBook from '../../components/FlipBook'
import { useWeb3Context, useLayoutContext, useGammaDataContext } from '../../hooks'

const GammaAlbumInfo = (props) => {
  const { t } = useTranslation()
  const { handleFinishInfoCard, userCard } = props
  const {
    loading,
    startLoading,
    stopLoading,
    ToggleShowDefaultButtons,
    updateShowButtons,
    updateFooterButtonsClasses
  } = useLayoutContext()
  const { gammaCardsContract, walletAddress } = useWeb3Context()
  const { ALBUMS, switchAlbum } = useGammaDataContext()
  const [userHasCard, setUserHasCard] = useState(false)

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
      emitError(t('transfer_album_error'))
    }
  }

  const handleBurnClick = async () => {
    switchAlbum(ALBUMS.ALBUM_BURN_SELECTION)
    handleFinishInfoCard(false)
  }

  const handleCloseButtonClick = () => {
    handleFinishInfoCard(false)
  }

  const TransferButton = () => (
    <div
      className={userHasCard ? 'option' : 'option_disabled'}
      onClick={() => handleTransferClick()}
    >
      {t('transferir')}
    </div>
  )

  const BurnButton = () => (
    <div className={userHasCard ? 'option' : 'option_disabled'} onClick={() => handleBurnClick()}>
      {t('burn_cards')}
    </div>
  )

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
        <TransferButton />
        {userCard.name === '121' && <BurnButton />}
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

  return loading ? <></> : <BookCard />
}

GammaAlbumInfo.propTypes = {
  userCard: PropTypes.object,
  handleFinishInfoCard: PropTypes.func
}

export default GammaAlbumInfo
