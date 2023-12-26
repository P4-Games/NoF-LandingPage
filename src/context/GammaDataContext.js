import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Web3Context } from './Web3Context'
import { getCardsByUser } from '../services/gamma'

const GammaDataContext = createContext()

const GammaDataContextProvider = ({ children }) => {
  const ALBUMS = {
    ALBUM_INVENTORY: 'inventory',
    ALBUM_120: 'album120',
    ALBUM_BURN_SELECTION: 'albumBurnSelection',
    ALBUM_TO_BURN: 'albumToBurn'
  }

  const { gammaCardsContract, walletAddress } = useContext(Web3Context)
  const [paginationObj, setPaginationObj] = useState({})
  const [currentAlbum, setCurrentAlbum] = useState(ALBUMS.INVENTORY)

  const refreshPaginationObj = async () => {
    const userCards = await getCardsByUser(gammaCardsContract, walletAddress)
    setPaginationObj(userCards)
  }

  const switchAlbum = async (album) => {
    setCurrentAlbum(album)
  }

  useEffect(() => {
    refreshPaginationObj()
    setCurrentAlbum(ALBUMS.ALBUM_INVENTORY)
  }, [gammaCardsContract, walletAddress]) //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GammaDataContext.Provider
      value={{
        paginationObj,
        currentAlbum,
        ALBUMS,
        refreshPaginationObj,
        switchAlbum
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
