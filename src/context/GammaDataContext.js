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
  const [paginationObjBurn, setPaginationObjBurn] = useState({})
  const [uniqueCardsQtty, setUniqueCardsQtty] = useState(0)
  const [repeatedCardsQtty, setRepeatedCardsQtty] = useState(0)
  const [albums120Qtty, setAlbums120Qtty] = useState(0)
  const [albums60Qtty, setAlbums60Qtty] = useState(0)
  const [cardsQttyToBurn, setCardsQttyToBurn] = useState(0)
  const [cardsToBurn, setCardsToBurn] = useState([])
  const [currentAlbum, setCurrentAlbum] = useState(ALBUMS.INVENTORY)

  const refreshPaginationObj = async () => {
    const userCards = await getCardsByUser(gammaCardsContract, walletAddress)
    setPaginationObj({}) // para limpiar ref
    setPaginationObj(userCards)
    setAlbums120Qtty(getAlbums120Qtty())
    setAlbums60Qtty(getAlbums60Qtty())
    setUniqueCardsQtty(getUniqueCardsQtty())
    setRepeatedCardsQtty(getRepeatedCardsQtty())
  }

  const generatePaginationObjToBurn = (force) => {
    if (!paginationObj) return
    if (Object.keys(paginationObjBurn).length === 0 || force) {
      // Se clona el objeto de paginado, para poder "jugar" con las cantidades
      const _cloneObject = JSON.parse(JSON.stringify(paginationObj))
      setPaginationObjBurn(_cloneObject)
    }
  }

  const cleanBurnObjects = () => {
    setPaginationObjBurn({})
    setCardsToBurn([])
    setCardsQttyToBurn(0)
  }

  const selectAllRepeatedCardsToBurn = (limit) => {
    if (!paginationObj || !paginationObj.user) return
    let total = 0
    let _cardsToBurn = []

    generatePaginationObjToBurn(true)

    for (let key in paginationObj.user) {
      if (
        paginationObj.user[key].quantity > 1 &&
        paginationObj.user[key].name != '120' &&
        paginationObj.user[key].name != '121'
      ) {
        let itemQttyRepeated = paginationObj.user[key].quantity - 1
        const cardNumber = paginationObj.user[key].name
        let itemQttyRepeatedCorrected = 0

        if (total + itemQttyRepeated > limit) {
          itemQttyRepeatedCorrected = total + itemQttyRepeated - limit
          itemQttyRepeated = itemQttyRepeated - itemQttyRepeatedCorrected
        }
        total += itemQttyRepeated
        _cardsToBurn = _cardsToBurn.concat(Array(itemQttyRepeated).fill(parseInt(cardNumber)))
        paginationObjBurn.user[cardNumber].quantity =
          paginationObjBurn.user[cardNumber].quantity - itemQttyRepeated
      }
    }
    setCardsQttyToBurn(total)
    setCardsToBurn(_cardsToBurn)
  }

  const switchAlbum = (album) => {
    setCurrentAlbum(album)
    if (
      album === ALBUMS.ALBUM_BURN_SELECTION &&
      (!paginationObjBurn || Object.keys(paginationObjBurn).length === 0)
    ) {
      generatePaginationObjToBurn()
    }
  }

  const getUniqueCardsQtty = () => {
    if (!paginationObj || !paginationObj.user) return
    let total = 0
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
    if (!paginationObj || !paginationObj.user) return
    let total = 0
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

  useEffect(() => {
    setAlbums120Qtty(getAlbums120Qtty())
    setAlbums60Qtty(getAlbums60Qtty())
    setUniqueCardsQtty(getUniqueCardsQtty())
    setRepeatedCardsQtty(getRepeatedCardsQtty())
  }, [paginationObj]) //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GammaDataContext.Provider
      value={{
        paginationObj,
        currentAlbum,
        ALBUMS,
        cardsQttyToBurn,
        cardsToBurn,
        uniqueCardsQtty,
        repeatedCardsQtty,
        albums120Qtty,
        albums60Qtty,
        paginationObjBurn,
        switchAlbum,
        setCardsQttyToBurn,
        setCardsToBurn,
        refreshPaginationObj,
        setPaginationObjBurn,
        generatePaginationObjToBurn,
        selectAllRepeatedCardsToBurn,
        cleanBurnObjects
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
