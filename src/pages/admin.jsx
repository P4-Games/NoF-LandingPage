import React, { useState, useEffect } from 'react'
import { adminAccounts } from '../config'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {useTranslation} from 'next-i18next'
import { useWeb3 } from '../hooks'

const Admin = React.forwardRef(() => {
  const {t} = useTranslation()
  const [, setSize] = useState(false)
  const { account, noMetamaskError, connectToMetamask } = useWeb3()
 
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
  

  return (
    <>
      <div className='admincontainer'>
        {!account && <div className='main_buttons_container'>
          <button
            className='alpha_button alpha_main_button'
            id='connect_metamask_button'
            onClick={() => connectToMetamask()}>{t('connect_metamask')}
          </button>
          <span>{noMetamaskError}</span>
        </div>}
        {(adminAccounts.includes(account)) &&
          <div className='adminpanel' />}
      </div>
    </>
  )
})

export default Admin

export async function getStaticProps ({locale}) {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  }
}
