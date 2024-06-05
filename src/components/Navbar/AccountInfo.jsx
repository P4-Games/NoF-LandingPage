import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import Swal from 'sweetalert2'
import { HiOutlineClipboardDocument } from 'react-icons/hi2'
import { GoLinkExternal } from 'react-icons/go'
import { AiOutlineSend, AiOutlineBank } from 'react-icons/ai'

import { useWeb3Context, useLayoutContext } from '../../hooks'
import { getBalance, getTokenName, transfer, mintDai } from '../../services/dai'
import { emitError, emitInfo, emitSuccess } from '../../utils/alert'
import { checkInputAddress, checkFloatValue1GTValue2 } from '../../utils/InputValidators'
import { getAccountAddressText } from '../../utils/stringUtils'

const AccountInfo = ({ showAccountInfo, setShowAccountInfo }) => {
  const { t } = useTranslation()
  const {
    walletAddress,
    connectWallet,
    disconnectWallet,
    getCurrentNetwork,
    isValidNetwork,
    enabledNetworkNames,
    daiContract,
    isConnected
  } = useWeb3Context()
  const { startLoading, stopLoading } = useLayoutContext()
  const [copiedTextVisible, setCopiedTextVisible] = useState(false)
  const [copiedTextPosition, setCopiedTextPosition] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)
  const [tokenName, setTokenName] = useState('')

  const currentNwk = getCurrentNetwork()

  const fetchTokenName = async () => {
    if (!walletAddress || !daiContract || !isValidNetwork) return
    try {
      const token = await getTokenName(daiContract)
      setTokenName(token)
    } catch (e) {
      console.error({ e })
    }
  }

  useEffect(() => {
    fetchTokenName()
  }, [showAccountInfo, tokenName, walletAddress, isValidNetwork]) //eslint-disable-line react-hooks/exhaustive-deps

  const fetchBalance = async () => {
    if (!walletAddress || !daiContract || !isValidNetwork) return
    try {
      const balance = await getBalance(daiContract, walletAddress)
      setWalletBalance(balance)
    } catch (e) {
      console.error({ e })
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [showAccountInfo, walletBalance, walletAddress, isValidNetwork]) //eslint-disable-line react-hooks/exhaustive-deps

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
  }

  const handleCopy = () => {
    copyToClipboard(walletAddress)
    setCopiedTextPosition(window.scrollY + 80)
    setCopiedTextVisible(true)
    setTimeout(() => {
      setCopiedTextVisible(false)
    }, 1000)
  }

  const handleMintDaiClick = async () => {
    try {
      setShowAccountInfo(false)

      // swal2-inputerror
      const result = await Swal.fire({
        title: `${t('account_mint_dai_title')}`,
        html: `
          <input id="amount" type='number' class="swal2-input" placeholder="${t('quantity')}">
        `,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: `${t('mintear')}`,
        confirmButtonColor: '#005EA3',
        color: 'black',
        background: 'white',
        customClass: {
          image: 'cardalertimg',
          input: 'alertinput'
        },
        preConfirm: () => {
          const amountInput = Swal.getPopup().querySelector('#amount')
          const amount = amountInput.value

          if (isNaN(amount)) {
            amountInput.classList.add('swal2-inputerror')
            Swal.showValidationMessage(`${t('amount_invalid')}`)
          } else {
            if (isNaN(amount)) {
              amountInput.classList.add('swal2-inputerror')
              Swal.showValidationMessage(`${t('amount_invalid')}`)
            }
          }
          return { amount: amount }
        }
      })

      if (result.isConfirmed) {
        startLoading()
        await mintDai(daiContract, walletAddress, result.value.amount)
        emitSuccess(t('confirmado'), 2000)
        stopLoading()
      }
    } catch (e) {
      stopLoading()
      console.error({ e })
      emitError(t('account_mint_dai_error'))
    }
  }

  const handleSendTokenClick = async () => {
    try {
      setShowAccountInfo(false)
      if (walletBalance === 0) {
        emitInfo(t('account_balance_zero', 2000))
        return
      }

      // swal2-inputerror
      const result = await Swal.fire({
        title: `${t('account_send_dai_title')}`,
        html: `
          <input id="wallet" class="swal2-input" placeholder="${t('wallet_destinatario')}">
          <input id="amount" type='number' class="swal2-input" placeholder="${t('quantity')}">
        `,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: `${t('transferir')}`,
        confirmButtonColor: '#005EA3',
        color: 'black',
        background: 'white',
        customClass: {
          image: 'cardalertimg',
          input: 'alertinput'
        },
        preConfirm: () => {
          const walletInput = Swal.getPopup().querySelector('#wallet')
          const amountInput = Swal.getPopup().querySelector('#amount')
          const wallet = walletInput.value
          const amount = amountInput.value

          if (
            !checkInputAddress(wallet, walletAddress) &&
            !checkFloatValue1GTValue2(amount, walletBalance)
          ) {
            walletInput.classList.add('swal2-inputerror')
            amountInput.classList.add('swal2-inputerror')
            Swal.showValidationMessage(
              `${t('direccion_destino_error')}<br />${t('quantity_invalid')}`
            )
          } else {
            if (!checkInputAddress(wallet, walletAddress)) {
              walletInput.classList.add('swal2-inputerror')
              Swal.showValidationMessage(`${t('direccion_destino_error')}`)
            }
            if (!checkFloatValue1GTValue2(amount, walletBalance)) {
              amountInput.classList.add('swal2-inputerror')
              Swal.showValidationMessage(`${t('quantity_invalid')}`)
            }
          }
          return { wallet: wallet, amount: amount }
        }
      })

      if (result.isConfirmed) {
        startLoading()
        await transfer(daiContract, result.value.wallet, result.value.amount)
        emitSuccess(t('confirmado'), 2000)
        stopLoading()
      }
    } catch (e) {
      stopLoading()
      console.error({ e })
      emitError(t('account_send_dai_error'))
    }
  }

  const ConnectButton = () => (
    <button
      onClick={() => {
        connectWallet()
        setShowAccountInfo(false)
      }}
      className='account__info__connect__btn'
    >
      {t('account_connect')}
    </button>
  )

  const DisconnectButton = () => (
    <button
      onClick={() => {
        disconnectWallet()
        setShowAccountInfo(false)
      }}
      className='account__info__disconnect__btn'
    >
      {t('account_disconnect')}
    </button>
  )

  const NetworkComponent = () => (
    <div className='account__info__icon__and__link'>
      <div>
        <p
          className={`account__info__account__network ${
            !isValidNetwork ? 'account__info__invalid__network' : ''
          }`}
        >
          {isValidNetwork
            ? currentNwk
              ? currentNwk.config.chainName
              : ''
            : t('account_invalid_network').replace('{NETWORKS}', enabledNetworkNames)}
        </p>
      </div>
      {/*!isValidNetwork && (
        <div className='account__info__icon__container'>
          <MdOutlinePublishedWithChanges
            onClick={() => {
              switchOrCreateNetwork()
            }}
            className='account__info__icon'
          />
        </div>
      )*/}
    </div>
  )

  const WalletComponent = () => (
    <div className='account__info__icon__and__link'>
      <div className='account__info__link__container'>
        {copiedTextVisible && (
          <span className='account__info__copied__text' style={{ top: copiedTextPosition }}>
            {t('account_text_copied')}
          </span>
        )}
        <p className='account__info__account__link' onClick={handleCopy}>
          {getAccountAddressText(walletAddress)}
        </p>
      </div>
      <div className='account__info__icon__container'>
        <HiOutlineClipboardDocument onClick={handleCopy} className='account__info__icon' />
        <Link
          href={currentNwk ? `${currentNwk.config.chainExplorerUrl}/address/${walletAddress}` : ''}
          target='_blank'
          rel='noreferrer'
          className='account__info__account__link'
        >
          <GoLinkExternal className='account__info__icon__link' />
        </Link>
      </div>
    </div>
  )

  const BalanceComponent = () => (
    <div className='account__info__icon__and__link'>
      <div>
        <p>{`${walletBalance} ${tokenName}`}</p>
      </div>

      <div className='account__info__icon__container'>
        {currentNwk?.config.environment == 'testing' && (
          <AiOutlineBank onClick={() => handleMintDaiClick()} className='account__info__icon' />
        )}
        <AiOutlineSend
          onClick={() => {
            handleSendTokenClick()
          }}
          className='account__info__icon'
        />
        <Link
          href={
            currentNwk
              ? `${currentNwk.config.chainExplorerUrl}/token/${daiContract.address}?a=${walletAddress}`
              : ''
          }
          target='_blank'
          rel='noreferrer'
          className='account__info__account__link'
        >
          <GoLinkExternal className='account__info__icon__link' />
        </Link>
      </div>
    </div>
  )

  return (
    <div className={`account__info ${showAccountInfo ? 'active' : ''}`}>
      {isConnected ? (
        <React.Fragment>
          <div className='account__info__data'>
            <NetworkComponent />
            {isValidNetwork && (
              <React.Fragment>
                <hr className='account__info__separator' />
                <WalletComponent />
                <BalanceComponent />
              </React.Fragment>
            )}
          </div>
          <hr className='account__info__separator' />
          <div className='account__info__disconnect__btn__container'>
            <DisconnectButton />
          </div>
        </React.Fragment>
      ) : (
        <div className='account__info__disconnect__btn__container'>
          <ConnectButton />
        </div>
      )}
    </div>
  )
}

AccountInfo.propTypes = {
  showAccountInfo: PropTypes.bool,
  setShowAccountInfo: PropTypes.func
}

export default AccountInfo
