import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import 'swiper/css/bundle'
import Swiper from 'swiper/bundle'
import AlphaAlbums from './AlphaAlbums'
import Rules from '../Common/Rules'
import { storageUrlAlpha, NETWORKS } from '../../config'
import {
  createNewSeason,
  buyPack,
  getAlbumData,
  checkPacks,
  getSeasonFolder,
  getUserCards,
  getWinnersBySeason,
  getAuthorized,
  transferCard,
  pasteCard,
  getSeasonPlayers
} from '../../services/alpha'
import { checkApproved, checkBalance, authorizeDaiContract } from '../../services/dai'
import CustomImage from '../../components/CustomImage'
import Swal from 'sweetalert2'
import { emitError, emitSuccess, emitInfo } from '../../utils/alert'

import { useTranslation } from 'next-i18next'
import { useWeb3Context, useLayoutContext } from '../../hooks'
import { NextFetchEvent } from 'next/server'

const vidas = [
  '/images/alpha/vida0.png',
  '/images/alpha/vida1.png',
  '/images/alpha/vida2.png',
  '/images/alpha/vida3.png',
  '/images/alpha/vida4.png',
  '/images/alpha/vida5.png'
]

let swiper //eslint-disable-line

const AlphaMain = () => {
  const { t } = useTranslation()

  const [pack, setPack] = useState(null)
  const [album, setAlbum] = useState([])
  const [albumImage, setAlbumImage] = useState(null)
  const [albumCollection, setAlbumCollection] = useState(null)
  const [albumCompletion, setAlbumCompletion] = useState(null)
  const [openSeaUrl, setOpenSeaUrl] = useState('')
  const [isCollection, setIsCollection] = useState(false)
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [cardIndex, setCardIndex] = useState(0)
  const [vida, setVida] = useState('/images/alpha/vida0.png')
  const [seasonNames, setSeasonNames] = useState(null)
  const [seasonName, setSeasonName] = useState('')
  const [packPrices, setPackPrices] = useState(null)
  const [packPrice, setPackPrice] = useState('')
  const [winnerPosition, setWinnerPosition] = useState(0)
  const [, setDisableTransfer] = useState(false)
  const [seasonFolder, setSeasonFolder] = useState(null)
  const { startLoading, stopLoading } = useLayoutContext()
  const {
    chainId,
    walletAddress,
    daiContract,
    alphaContract,
    connectWallet,
    isConnected,
    isValidNetwork,
    enabledNetworkNames
  } = useWeb3Context()
  const [showRules, setShowRules] = useState(false)
  const [albums, setAlbums] = useState(null)
  const [showMain, setShowMain] = useState(false)
  const [disableBuyPackButton, setDisableBuyPackButton] = useState(false)

  const fetchAlbums = async () => {
    try {
      if (!walletAddress || !isValidNetwork || !alphaContract || !seasonNames) return
      startLoading()

      let albumsArr = []
      for (let i = 0; i < seasonNames.length; i++) {
        const album = await alphaContract.getCardsByUserBySeason(walletAddress, seasonNames[i])
        for (let j = 0; j < album.length; j++) {
          if (album[j].class == 0) {
            const folder = await getSeasonFolder(alphaContract, album[j].season)
            albumsArr.push([album[j], folder])
          }
        }
      }
      setAlbums(albumsArr)
      stopLoading()
    } catch (ex) {
      stopLoading()
      console.error({ ex })
      emitError(t('alpha_fetch_albums_error'))
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [isValidNetwork, albums]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchSeasonData()
    setShowMain(false)
  }, [walletAddress, isValidNetwork]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    swiper = new Swiper('.swiper-container', {
      effect: 'cards',
      grabCursor: true,
      centeredSlides: true,
      setWrapperSize: true,
      slidesPerView: 1,
      initialSlide: 0,
      runCallbacksOnInit: true,
      observer: true,
      cardsEffect: {
        slideShadows: false
      },
      pagination: {
        el: '.swiper-pagination'
      },
      on: {
        init: (res) => {
          setCardIndex(res.activeIndex)
          if (cards.length > 0) {
            if (cards[res.activeIndex].collection == albumCollection) {
              setIsCollection(true)
            } else {
              setIsCollection(false)
            }
          }
        },
        slideChange: (res) => {
          setCardIndex(res.activeIndex)
          if (cards[res.activeIndex]?.collection == albumCollection) {
            setIsCollection(true)
          } else {
            setIsCollection(false)
          }
        },
        observerUpdate: (res) => {
          setCardIndex(res.activeIndex)
          if (cards[res.activeIndex]?.collection == albumCollection) {
            setIsCollection(true)
          } else {
            setIsCollection(false)
          }
        },
        slidesLengthChange: () => {
          // check function
        }
      }
    })
  }, [pack, cards, albumCollection])

  useEffect(() => {
    const seasonNameElem = document.getElementsByClassName('alpha_season_name')[0]
    if (seasonName) {
      if (seasonName.length > 14) {
        seasonNameElem.style.fontSize = '0.7rem'
      }
      if (seasonName.length > 16) {
        seasonNameElem.style.fontSize = '0.6rem'
        seasonNameElem.innerText = seasonNameElem.innerText.substring(0, 16) + '...'
      }
    }
  }, [seasonName])

  const resetShowMain = (cardsData) => {
    startLoading()
    setCards([])
    setShowMain(false)
    setTimeout(() => {
      setCards(cardsData)
      setShowMain(true)
      stopLoading()
    }, 500)
  }

  const getOpenseaUrl = () => {
    let baseUrl = ''
    let chainName = ''
    if (chainId) {
      Object.entries(NETWORKS).forEach(([key, value]) => {
        if (value.config.chainId == chainId) {
          const openseaUrl = value.config.chainOpenSeaBaseUrl
          baseUrl = openseaUrl
          chainName = value.config.chainName
        }
      })
      return `${baseUrl}/assets/${chainName}/${alphaContract?.address}`
    } else {
      return ''
    }
  }

  const fetchSeasonData = async () => {
    try {
      if (!walletAddress || !isValidNetwork || !alphaContract) return
      startLoading()
      let seasonData = await alphaContract.getSeasonData()

      if (seasonData) {
        let currentSeason
        let currentPrice
        for (let i = 0; i < seasonData[0].length; i++) {
          const seasonName = seasonData[0][i]
          const seasonPackPrice = seasonData[1][i]
          const packsAvailable = await checkPacks(alphaContract, seasonName)
          if (!packsAvailable) {
            stopLoading()
            emitError(t('alpha_fetch_season_data_error'))
            return
          }
          if (packsAvailable.length > 0) {
            currentSeason = seasonName
            currentPrice = seasonPackPrice
            break
          } else {
            currentSeason = seasonName
            currentPrice = seasonPackPrice
          }
        }

        const seasonWinnersCount = {}
        for (let i = 0; i < seasonData[0].length; i++) {
          const winnersBySeason = await getWinnersBySeason(alphaContract, seasonData[0][i])
          seasonWinnersCount[seasonData[0][i]] = winnersBySeason.length
        }

        const finishedSeasons = Object.entries(seasonWinnersCount)
          .filter((season) => season[1] == 10)
          .map((season) => season[0])
        const activeSeasons = seasonData[0].filter((season) => !finishedSeasons.includes(season))

        setSeasonName(currentSeason)
        setPackPrice(currentPrice?.toString())
        setPackPrices(seasonData[1])
        setSeasonNames(activeSeasons)

        if (!activeSeasons || !activeSeasons.length) {
          setError(t('no_season_names'))
        } else {
          setError('')
        }
      }
      stopLoading()
    } catch (ex) {
      stopLoading()
      console.error(ex)
      emitError(t('alpha_fetch_season_data_error'))
    }
  }

  const handleCreateNewSeason = async () => {
    try {
      const authorization = await getAuthorized(alphaContract, walletAddress)
      if (authorization) {
        const result = await Swal.fire({
          title: `${t('alpha_season_create_title')}`,
          html: `<input id="name" class="swal2-input" placeholder="${t('alpha_season_name')}">
            <input id="packPrice" type='number' class="swal2-input" placeholder="${t(
              'alpha_season_pack_price'
            )}">`,

          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: `${t('alpha_confirm_new_season')}`,
          confirmButtonColor: '#005EA3',
          color: 'black',
          background: 'white',
          customClass: {
            image: 'cardalertimg',
            input: 'alertinput'
          },
          preConfirm: () => {
            const nameInput = Swal.getPopup().querySelector('#name')
            const priceInput = Swal.getPopup().querySelector('#packPrice')
            const name = nameInput.value
            const price = priceInput.value

            if (name.length > 12) {
              nameInput.classList.add('swal2-inputerror')
              Swal.showValidationMessage(`${t('alpha_season_name_error')}`)
            }
            if (price < 1) {
              priceInput.classList.add('swal2-inputerror')
              Swal.showValidationMessage(`${t('alpha_season_price_error')}`)
            }

            return { name: name, price: price }
          }
        })

        if (result.isConfirmed) {
          startLoading()
          const tx = await createNewSeason(alphaContract, result.value.name, result.value.price)
          stopLoading()
          if (!tx) {
            emitError(t('alpha_create_new_season_error'))
          } else {
            emitSuccess(t('confirmado'), 2000)
            fetchSeasonData()
          }
        }
      } else {
        emitInfo(t('alpha_season_authorization'), 2000)
      }
    } catch (e) {
      console.error({ e })
      stopLoading()
      emitError(t('alpha_create_new_season_error'))
    }
  }

  const showCards = async (address, seasonName, isBuyingPack = true) => {
    startLoading()
    try {
      const checkPacksResult = await checkPacks(alphaContract, seasonName)
      if (!checkPacksResult) {
        stopLoading()
        emitError(t('alpha_show_cards_error'))
        return
      }

      setDisableTransfer(checkPacksResult.length == 0 ? false : true)

      const cards = await getUserCards(alphaContract, address, seasonName)
      if (!cards) {
        stopLoading()
        emitError(t('alpha_show_cards_error'))
        return
      }

      if (cards.length) {
        const albumData = []
        const cardsData = []

        cards.forEach((card) => {
          card.class == 0 ? albumData.push(card) : cardsData.push(card)
        })

        const openSeaBaseUrl = getOpenseaUrl()
        const openSeaFullUrl = `${openSeaBaseUrl}/${albumData[0].tokenId}`

        setOpenSeaUrl(openSeaFullUrl)
        setError('')
        setPack(cards)
        setAlbum(albumData)
        setAlbumCollection(ethers.BigNumber.from(albumData[0].collection).toNumber())
        const completion = ethers.BigNumber.from(albumData[0].completion).toNumber()
        setAlbumCompletion(completion)
        setVida(vidas[completion])

        const seasonFolderData = await getSeasonFolder(alphaContract, seasonName)
        if (!seasonFolderData) {
          stopLoading()
          emitError(t('alpha_show_cards_error'))
          return
        }
        setSeasonFolder(
          seasonFolderData == 'alpha_jsons' ? 'T1' : seasonFolderData || 'UNKNOWN_FOLDER'
        )
        const baseUrl = `${storageUrlAlpha}/${seasonFolder || 'T1'}`
        setAlbumImage(
          completion < 5
            ? `${baseUrl}/${albumData[0].number + '.png'}`
            : `${baseUrl}/${albumData[0].number + 'F.png'}`
        )
        if (completion >= 5) {
          try {
            const winners = await getWinnersBySeason(alphaContract, seasonName)
            if (winners.includes(walletAddress)) {
              setWinnerPosition(winners.indexOf(walletAddress) + 1)
            }
          } catch (e) {
            stopLoading()
            console.error({ e })
          }
        } else {
          setWinnerPosition(0)
        }

        if (showMain) {
          resetShowMain(cardsData)
        } else {
          setCards(cardsData)
          setShowMain(true)
          stopLoading()
        }

        return cards
      } else {
        stopLoading()
        if (!isBuyingPack) {
          Swal.fire({
            text: `${t('alpha_no_cards_error_text')}`,
            icon: 'info',
            showDenyButton: false,
            showCancelButton: false,
            color: 'black',
            background: 'white',
            customClass: {
              image: 'cardalertimg',
              input: 'alertinput'
            }
          })
        }
      }
    } catch (ex) {
      emitError(t('alpha_show_cards_error'))
      console.error(ex)
    }
  }

  const handleBuyPack = async (price, name) => {
    setDisableBuyPackButton(true)
    startLoading()
    try {
      const cards = await showCards(walletAddress, seasonName)
      if (cards && cards.length > 0) {
        setDisableBuyPackButton(false)
        stopLoading()
        emitSuccess(t('ya_tienes_cartas'), 2000)
        return
      }

      const packs = await checkPacks(alphaContract, name)
      if (!packs) {
        setDisableBuyPackButton(false)
        stopLoading()
        emitError(t('alpha_buy_pack_error'))
        return
      }
      if (packs.length == 0) {
        setDisableBuyPackButton(false)
        stopLoading()
        emitInfo(t('no_mas_packs'))
        return
      } else {
        const balance = await checkBalance(daiContract, walletAddress, packPrice)
        if (balance) {
          const result = await Swal.fire({
            text: `${t('alpha_buy_pack_text')
              .replace('{PRICE}', packPrice?.substring(0, packPrice.length - 18))
              .replace('{SEASON_NAME}', seasonName)}`,
            icon: 'warning',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: `${t('comprar_pack')}`,
            confirmButtonColor: '#005EA3',
            color: 'black',
            background: 'white'
          })
          stopLoading()

          if (result.isDismissed || result.isDenied) {
            setDisableBuyPackButton(false)
          }

          if (result.isConfirmed) {
            startLoading()
            const approved = await checkApproved(daiContract, walletAddress, alphaContract.address)
            if (approved) {
              try {
                const pack = await buyPack(alphaContract, price, name)
                if (!pack) {
                  setDisableBuyPackButton(false)
                  stopLoading()
                  emitError(t('alpha_buy_pack_error'))
                  return
                } else {
                  setPack(pack)
                  setDisableBuyPackButton(false)
                  stopLoading()
                  emitSuccess(t('confirmed'), 2000)
                  await showCards(walletAddress, seasonName)
                }
              } catch (err) {
                console.error({ err })
                setDisableBuyPackButton(false)
                stopLoading()
                emitError(t('alpha_buy_pack_error'))
                return
              }
            } else {
              try {
                await authorizeDaiContract(
                  daiContract,
                  alphaContract.address,
                  ethers.constants.MaxUint256
                )
                if (!approved) {
                  emitError(t('alpha_buy_pack_error'))
                  setDisableBuyPackButton(false)
                  stopLoading()
                  return
                } else {
                  const pack = await buyPack(alphaContract, price, name)
                  if (!pack) {
                    setDisableBuyPackButton(false)
                    stopLoading()
                    emitError(t('alpha_buy_pack_error'))
                    return
                  } else {
                    setPack(pack)
                    setDisableBuyPackButton(false)
                    stopLoading()
                    await showCards(walletAddress, seasonName)
                  }
                }
              } catch (err) {
                console.error({ err })
                setDisableBuyPackButton(false)
                stopLoading()
                emitError(t('alpha_buy_pack_error'))
                return
              }
            }
          }
        } else {
          setDisableBuyPackButton(false)
          stopLoading()
          emitInfo(t('no_dai'))
          return
        }
      }
    } catch (err) {
      console.error({ err })
      stopLoading()
      emitError(t('alpha_buy_pack_error'))
      return
    }
  }

  const handlePasteCard = async (cardIndex) => {
    try {
      startLoading()
      const cardTokenId = ethers.BigNumber.from(cards[cardIndex].tokenId).toNumber()
      const albumTokenId = ethers.BigNumber.from(album[0].tokenId).toNumber()
      const tx = await pasteCard(alphaContract, cardTokenId, albumTokenId)
      if (!tx) {
        stopLoading()
        emitError(t('alpha_paste_card_error'))
      } else {
        stopLoading()
        const albumData = await getAlbumData(alphaContract, albumTokenId)
        if (albumData.completion == 5) {
          emitSuccess(t('album_completo'), 5000)
        } else {
          emitSuccess(t('carta_en_album'), 2000)
        }
        await showCards(walletAddress, seasonName, false)
      }
    } catch (e) {
      console.error({ e })
      stopLoading()
      emitError(t('alpha_paste_card_error'))
    }
  }

  const handleTokenTransfer = async (tokenId, collection) => {
    const players = await getSeasonPlayers(alphaContract, seasonName)
    const playersOptions = players
      .filter((player) => player != walletAddress)
      .reduce(
        (obj, player) => ({ ...obj, [player]: player.slice(0, 6) + '...' + player.slice(-6) }),
        {}
      )
    if (Object.keys(playersOptions).length < 9) {
      emitInfo(t('alpha_transfer_card_must_wait'))
      return
    }
    try {
      const result = await Swal.fire({
        title: `${t('alpha_transfer_card_title')} ${collection}`,
        input: 'select',
        inputPlaceholder: `${t('wallet_destinatario')}`,
        inputOptions: playersOptions,
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
        inputValidator: (value) => {
          if (!value) {
            return `${t('error')}`
          }
        }
      })

      if (result.isConfirmed) {
        startLoading()
        const tx = await transferCard(alphaContract, walletAddress, result.value, tokenId)
        if (!tx) {
          stopLoading()
          emitError(t('alpha_transfer_card_error'))
        } else {
          stopLoading()
          emitSuccess(t('carta_enviada'), 2000)
          await showCards(walletAddress, seasonName, false)
        }
      }
    } catch (e) {
      stopLoading()
      console.error({ e })
      emitError(t('alpha_transfer_card_error'))
    }
  }

  const NotConnected = () => (
    <div className='alpha'>
      <div className='main_buttons_container'>
        {!isConnected && (
          <button
            className='alpha_button alpha_main_button'
            id='connect_wallet_button'
            onClick={() => connectWallet()}
          >
            {t('connect_wallet')}
          </button>
        )}
        {isConnected && !isValidNetwork && (
          <div className='invalid__network__div'>
            <span className='invalid__network'>
              {t('account_invalid_network').replace('{NETWORKS}', enabledNetworkNames)}
            </span>
          </div>
        )}
        <button
          className='alpha_button alpha_main_button'
          id='show_rules_button'
          onClick={() => setShowRules(true)}
        >
          {t('reglas')}
        </button>
      </div>
    </div>
  )

  return (
    <div className='alpha_main'>
      <div className='alpha'>
        {(!isConnected || !isValidNetwork) && <NotConnected />}

        {showRules && <Rules type='alpha' setShowRules={setShowRules} />}

        {isConnected && isValidNetwork && alphaContract && seasonNames && (
          <div
            className={
              showMain
                ? 'alpha_inner_container alpha_inner_container_open'
                : 'alpha_inner_container'
            }
          >
            <div className='alpha_data'>
              {!error && seasonNames && seasonNames.length && seasonName && !showMain && (
                <>
                  <div className='alpha_season'>
                    <img alt='marco' src={'/images/common/marco.png'} />
                    <span className='alpha_season_name'>{seasonName}</span>
                    <select
                      value={seasonName}
                      onChange={(e) => {
                        setSeasonName(e.target.value)
                        setPackPrice(
                          ethers.BigNumber.from(
                            packPrices[seasonNames.indexOf(e.target.value)]
                          ).toString()
                        )
                      }}
                      id='alpha_select_season_button'
                    >
                      {seasonNames &&
                        seasonNames.length &&
                        seasonNames.map((name) => <option key={name}>{name}</option>)}
                    </select>
                  </div>
                  <div className='alpha_start_buttons'>
                    <button
                      onClick={() => showCards(walletAddress, seasonName, false)}
                      className='alpha_button'
                      id='alpha_show_cards_button'
                    >
                      {t('ver_cartas')}
                    </button>
                    <button
                      onClick={() => handleBuyPack(packPrice, seasonName)}
                      className='alpha_button'
                      id='alpha_buy_pack_button'
                      disabled={disableBuyPackButton}
                    >
                      {`${t('comprar_pack')}`}
                    </button>
                    <button
                      id='alpha-create-new-season-button'
                      className='alpha_button alpha_main_button'
                      onClick={() => handleCreateNewSeason()}
                    >
                      {t('alpha_create_new_season')}
                    </button>
                  </div>
                </>
              )}
              <span
                style={{
                  color: 'red',
                  textAlign: 'center',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {error}
                {error == t('no_season_names') && (
                  <button
                    id='alpha-create-new-season-button'
                    className='alpha_button alpha_main_button'
                    onClick={() => handleCreateNewSeason()}
                  >
                    {t('alpha_create_new_season')}
                  </button>
                )}
              </span>
            </div>

            {pack && pack.length && showMain ? (
              <div className='alpha_container'>
                <div className='alpha_album_container'>
                  <a href={openSeaUrl} target='_blank'>
                    <CustomImage alt='alpha-album' src={albumImage} className='alpha_album' />
                  </a>
                </div>
                <div className='alpha_progress_container'>
                  <span>
                    {winnerPosition == 0
                      ? `${t('progreso')}: ${albumCompletion}/5`
                      : `${t('posicion')}: ${winnerPosition}`}
                  </span>
                  <img alt='vida' src={vida} />
                  <span>
                    {t('album')}: #{albumCollection}
                  </span>
                  <div className='alpha_progress_button_container'>
                    <button
                      className='alpha_button'
                      onClick={() => handlePasteCard(cardIndex)}
                      disabled={!isCollection}
                    >
                      {t('pegar')}
                    </button>
                    <button
                      className='alpha_button'
                      onClick={() => {
                        const tokenId = ethers.BigNumber.from(cards[cardIndex].tokenId).toNumber()
                        const collection = ethers.BigNumber.from(
                          cards[cardIndex].collection
                        ).toNumber()
                        handleTokenTransfer(tokenId, collection)
                      }}
                      disabled={!(cards.length > 0)}
                    >
                      {t('transferir')}
                    </button>
                  </div>
                </div>
                <div className='alpha_cards_container'>
                  <div className='swiper-container alpha-swiper-container'>
                    <div className='swiper-wrapper alpha-swiper-wrapper'>
                      {cards.map((card) => {
                        const cardCollection = ethers.BigNumber.from(card.collection).toNumber()
                        return (
                          <div
                            style={{
                              backgroundImage: 'none',
                              paddingTop: '0'
                            }}
                            className='swiper-slide alpha-swiper-slide'
                            key={ethers.BigNumber.from(card.tokenId).toNumber()}
                          >
                            <span className='alpha_card_collection'>A:{cardCollection}</span>
                            <CustomImage
                              alt='img'
                              src={`${storageUrlAlpha}/${seasonFolder || 'T1'}/${card.number}.png`}
                              className='alpha_card'
                            />
                          </div>
                        )
                      })}
                    </div>
                    <div className='swiper-pagination' />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <AlphaAlbums setSeasonName={setSeasonName} />
      </div>
    </div>
  )
}

export default AlphaMain
