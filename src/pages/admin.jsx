import React from 'react'
import { adminAccounts, combinedVariables } from '../config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useWeb3Context } from '../hooks'

const Admin = () => {
  const { t } = useTranslation()
  const { walletAddress, web3Error, connectWallet } = useWeb3Context()

  console.log(combinedVariables)

  return (
    <div className='admincontainer'>
      {!walletAddress && (
        <div className='main_buttons_container'>
          <button
            className='alpha_button alpha_main_button'
            id='connect_wallet_button'
            onClick={() => connectWallet()}
          >
            {t('connect_wallet')}
          </button>
          <span>{web3Error}</span>
        </div>
      )}
      {adminAccounts.includes(walletAddress) && <div className='adminpanel' />}
    </div>
  )
}

export default Admin

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}
