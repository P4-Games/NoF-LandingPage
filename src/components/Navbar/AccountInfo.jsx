import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import Swal from 'sweetalert2'
import { HiOutlineClipboardDocument } from 'react-icons/hi2'
import { IoOpenOutline } from 'react-icons/io5'
import { AiOutlineSend } from 'react-icons/ai'
import { MdOutlinePublishedWithChanges } from 'react-icons/md'
import { useWeb3Context, useLayoutContext } from '../../hooks'
import { NETWORK, CONTRACTS } from '../../config'
import { getBalance, getTokenName, transfer } from '../../services/dai'
import { emitError, emitInfo, emitSuccess } from '../../utils/alert'
import { checkInputAddress, checkValue1GTValue2 } from '../../utils/InputValidators'

const AccountInfo = ({ showAccountInfo, setShowAccountInfo }) => {
  const { t } = useTranslation()
  const {
    walletAddress,
    connectWallet,
    disconnectWallet,
    isValidNetwork,
    daiContract,
    switchOrCreateNetwork
  } = useWeb3Context()
  const { startLoading, stopLoading } = useLayoutContext()
  const [copiedTextVisible, setCopiedTextVisible] = useState(false)
  const [copiedTextPosition, setCopiedTextPosition] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)
  const [tokenName, setTokenName] = useState('')

  const fetchTokenName = async () => {
    if (!walletAddress || !daiContract) return
    const token = await getTokenName(daiContract)
    setTokenName(token)
  }

  useEffect(() => {
    fetchTokenName()
  }, [showAccountInfo, tokenName, walletAddress]) //eslint-disable-line react-hooks/exhaustive-deps

  const fetchBalance = async () => {
    if (!walletAddress || !daiContract) return
    const balance = await getBalance(daiContract, walletAddress)
    setWalletBalance(balance)
  }

  useEffect(() => {
    fetchBalance()
  }, [showAccountInfo, walletBalance, walletAddress]) //eslint-disable-line react-hooks/exhaustive-deps

  const getAccountAddressText = () => {
    if (walletAddress <= 15) {
      return walletAddress
    } else {
      const firstPart = walletAddress.substring(0, 7)
      const lastPart = walletAddress.substring(walletAddress.length - 5)
      return `${firstPart}...${lastPart}`
    }
  }

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
          <input id="amount" type='number' class="swal2-input" placeholder="${t('cantidad')}">
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
          // document.getElementById('Wwallet').remove('swal2-inputerror')
          // amountInput.classList.remove('swal2-inputerror')

          if (
            !checkInputAddress(wallet, walletAddress) &&
            !checkValue1GTValue2(amount, walletBalance)
          ) {
            walletInput.classList.add('swal2-inputerror')
            amountInput.classList.add('swal2-inputerror')
            Swal.showValidationMessage(
              `${t('direccion_destino_error')}<br />${t('account_send_dai_quantity_invalid')}`
            )
          } else {
            if (!checkInputAddress(wallet, walletAddress)) {
              walletInput.classList.add('swal2-inputerror')
              Swal.showValidationMessage(`${t('direccion_destino_error')}`)
            }
            if (!checkValue1GTValue2(amount, walletBalance)) {
              amountInput.classList.add('swal2-inputerror')
              Swal.showValidationMessage(`${t('account_send_dai_quantity_invalid')}`)
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
    } catch (ex) {
      stopLoading()
      console.error({ ex })
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
    <div className='account_info__icon__and__link'>
      <div>
        <p
          className={`account_info__account__network ${
            !isValidNetwork() ? 'account_info__invalid__network' : ''
          }`}
        >
          {isValidNetwork() ? NETWORK.chainName : t('account_invalid_network')}
        </p>
      </div>
      {!isValidNetwork() && (
        <div className='account__info__icon__container'>
          <MdOutlinePublishedWithChanges
            onClick={() => {
              switchOrCreateNetwork(
                NETWORK.chainId,
                NETWORK.chainName,
                NETWORK.ChainRpcUrl,
                NETWORK.chainCurrency,
                NETWORK.chainExplorerUrl
              )
            }}
            className='account_info__icon'
          />
        </div>
      )}
    </div>
  )

  const WalletComponent = () => (
    <div className='account_info__icon__and__link'>
      <div className='account_info__link__container'>
        {copiedTextVisible && (
          <span className='account_info__copied__text' style={{ top: copiedTextPosition }}>
            {t('account_text_copied')}
          </span>
        )}
        <p className='account_info__account__link' onClick={handleCopy}>
          {getAccountAddressText()}
        </p>
      </div>
      <div className='account_info__icon__container'>
        <HiOutlineClipboardDocument onClick={handleCopy} className='account_info__icon' />
        <Link
          href={`${NETWORK.chainExplorerUrl}/address/${walletAddress}`}
          target='_blank'
          rel='noreferrer'
          className='account_info__account__link'
        >
          <IoOpenOutline className='account_info__icon' />
        </Link>
      </div>
    </div>
  )

  const BalanceComponent = () => (
    <div className='account_info__icon__and__link'>
      <div>
        <p>{`${walletBalance} ${tokenName}`}</p>
      </div>
      <div className='account__info__icon__container'>
        <AiOutlineSend
          onClick={() => {
            handleSendTokenClick()
          }}
          className='account_info__icon'
        />
        <Link
          href={`${NETWORK.chainExplorerUrl}/token/${CONTRACTS.daiAddress}?a=${walletAddress}`}
          target='_blank'
          rel='noreferrer'
          className='account_info__account__link'
        >
          <IoOpenOutline className='account_info__icon' />
        </Link>
      </div>
    </div>
  )

  return (
    <div className={`account__info ${showAccountInfo ? 'active' : ''}`}>
      {walletAddress ? (
        <React.Fragment>
          <div className='account__info__data'>
            <NetworkComponent />
            {isValidNetwork() && (
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
