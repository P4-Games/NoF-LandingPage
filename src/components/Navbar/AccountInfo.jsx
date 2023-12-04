import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { HiOutlineClipboardDocument } from 'react-icons/hi2'
import { IoOpenOutline } from 'react-icons/io5'
import { AiOutlineSend } from 'react-icons/ai'
import { MdOutlinePublishedWithChanges } from 'react-icons/md'
import { useWeb3Context } from '../../hooks'
import { NETWORK, CONTRACTS } from '../../config'
import { getBalance, getTokenName } from '../../services/dai'

const AccountInfo = ({ showAccountInfo, setShowAccountInfo }) => {
  const {
    walletAddress,
    connectWallet,
    disconnectWallet,
    isValidNetwork,
    daiContract,
    switchOrCreateNetwork
  } = useWeb3Context()
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
  }, [tokenName, walletAddress]) //eslint-disable-line react-hooks/exhaustive-deps


  const fetchBalance = async () => {
    if (!walletAddress || !daiContract) return
    const balance = await getBalance(daiContract, walletAddress)
    setWalletBalance(balance)
  }

  useEffect(() => {
    fetchBalance()
  }, [walletBalance, walletAddress]) //eslint-disable-line react-hooks/exhaustive-deps

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

  const ConnectButton = () => (
    <button
      onClick={() => {
        connectWallet()
        setShowAccountInfo(false)
      }}
      className='account__info__disconnect__btn'
    >
      Conectar
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
      Desconectar
    </button>
  )

  const NetworkComponent = () => (
    <div className='account_info__icon__and__link'>
      <div>
        <p className={`account_info__account__network ${!isValidNetwork() 
            ? 'account_info__invalid__network' 
            : ''}`}
        >
          {isValidNetwork() ? NETWORK.chainName : 'Red Inválida'}
        </p>
      </div>
      { !isValidNetwork() &&
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
      </div>}
    </div>
  )

  const WalletComponent = () => (
    <div className='account_info__icon__and__link'>
      <div className='account_info__link__container'>
        {copiedTextVisible && (
          <span className='account_info__copied__text' style={{ top: copiedTextPosition }}>
            Copied
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
        <AiOutlineSend className='account_info__icon' />
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
