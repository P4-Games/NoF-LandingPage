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
  const [cardsQttyToBurn, setCardsQttyToBurn] = useState(0)
  const [cardsToBurn, setCardsToBurn] = useState([])

  const refreshPaginationObj = async () => {
    const userCards = await getCardsByUser(gammaCardsContract, walletAddress)
    setPaginationObj(userCards)
  }

  const switchAlbum = async (album) => {
    setCurrentAlbum(album)
  }

  const getUniqueCardsQtty = () => {
    let total = 0
    if (!paginationObj || !paginationObj.user) return
    for (let key in paginationObj.user) {
      if (
        paginationObj.user[key].quantity > 0 &&
        paginationObj.user[key].name != '120' &&
        paginationObj.user[key].name != '121'
      ) {
        total += 1
      }
    }
    return total
  }

  const getRepeatedCardsQtty = () => {
    let total = 0
    if (!paginationObj || !paginationObj.user) return
    for (let key in paginationObj.user) {
      if (
        paginationObj.user[key].quantity > 1 &&
        paginationObj.user[key].name != '120' &&
        paginationObj.user[key].name != '121'
      ) {
        total += paginationObj.user[key].quantity - 1
      }
    }
    return total
  }

  const getAlbums120Qtty = () => {
    if (!paginationObj || !paginationObj.user) return

    const albums120Quantity = Object.values(paginationObj.user).filter(
      (album) => album.quantity > 0 && album.name === '120'
    ).length

    return albums120Quantity
  }

  const getAlbums60Qtty = () => {
    if (!paginationObj || !paginationObj.user) return

    const albums120Quantity = Object.values(paginationObj.user).filter(
      (album) => album.quantity > 0 && album.name === '121'
    ).length

    return albums120Quantity
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
        cardsQttyToBurn, 
        cardsToBurn, 
        setCardsQttyToBurn,
        setCardsToBurn,
        refreshPaginationObj,
        switchAlbum,
        getUniqueCardsQtty,
        getAlbums120Qtty,
        getAlbums60Qtty,
        getRepeatedCardsQtty
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
