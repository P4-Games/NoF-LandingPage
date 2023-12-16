import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Web3Context } from './Web3Context'
import { getCardsByUser } from '../services/gamma'

const GammaDataContext = createContext()

const GammaDataContextProvider = ({ children }) => {
  const { gammaCardsContract, walletAddress } = useContext(Web3Context)
  const [paginationObj, setPaginationObj] = useState({})

  const refreshPaginationObj = async () => {
    const userCards = await getCardsByUser(gammaCardsContract, walletAddress)
    setPaginationObj(userCards)
  }

  useEffect(() => {
    refreshPaginationObj()
  }, [gammaCardsContract, walletAddress]) //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GammaDataContext.Provider
      value={{
        paginationObj,
        refreshPaginationObj
      }}
    >
      {children}
    </GammaDataContext.Provider>
  )
}

GammaDataContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export { GammaDataContext, GammaDataContextProvider }
