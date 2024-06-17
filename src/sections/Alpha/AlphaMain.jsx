import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import 'swiper/css/bundle'
import Swiper from 'swiper/bundle'
import AlphaAlbums from './AlphaAlbums'
import Rules from '../Common/Rules'
import { storageUrlAlpha } from '../../config'
import {
  fetchDataAlpha,
  createNewSeason,
  getAlbumData,
  checkPacks,
  getSeasonFolder,
  getUserCards,
  getWinners,
  getAuthorized,
  transferCard,
  pasteCard,
  getSeasonPlayers
} from '../../services/alpha'
import { checkApproved, checkBalance, authorizeDaiContract } from '../../services/dai'
import CustomImage from '../../components/CustomImage'
import Swal from 'sweetalert2'
import { emitError, emitSuccess } from '../../utils/alert'

import { useTranslation } from 'next-i18next'
import { useWeb3Context, useLayoutContext } from '../../hooks'
import { checkInputAddress } from '../../utils/InputValidators'

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
  const [isCollection, setIsCollection] = useState(false)
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [cardIndex, setCardIndex] = useState(0)
  const [vida, setVida] = useState('/images/alpha/vida0.png')
  const [seasonNames, setSeasonNames] = useState(null)
  const [seasonName, setSeasonName] = useState('')
  const [packPrices, setPackPrices] = useState(null)
  const [packPrice, setPackPrice] = useState('')
  const [receiverAccount, setReceiverAccount] = useState('')
  const [cardToTransfer, setCardToTransfer] = useState(null)
  const [winnerPosition, setWinnerPosition] = useState(0)
  const [transferError, setTransferError] = useState('')
  const [, setDisableTransfer] = useState(false)
  const [seasonFolder, setSeasonFolder] = useState(null)
  const { startLoading, stopLoading } = useLayoutContext()
  const {
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

  function clickFromAlbums() {
    alphaMidButton()
    setShowMain((prevShowMain) => !prevShowMain)
  }

  function alphaMidButton() {
    const albums = document.getElementsByClassName('alpha_full_albums_container')
    const game = document.getElementsByClassName('alpha_inner_container')
    if (game && game.length > 0) {
      albums[0].classList.toggle('alpha_display_none')
      game[0].classList.toggle('alpha_display_none')
    }
  }

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
      emitError(t('alpha_fetch_albums'))
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [walletAddress, isValidNetwork, albums]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchSeasonData()
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

  const fetchSeasonData = async () => {
    try {
      if (!walletAddress || !isValidNetwork || !alphaContract) return
      startLoading()
      let seasonData = await alphaContract.getSeasonData()

      if (seasonData) {
        let currentSeason
        let currentPrice

        for (let i = 0; i < seasonData[0].length; i++) {
          const season = await alphaContract.getSeasonAlbums(seasonData[0][i])

          if (season.length > 0) {
            currentSeason = seasonData[0][i]
            currentPrice = seasonData[1][i]
            break
          } else {
            currentSeason = seasonData[0][i]
            currentPrice = seasonData[1][i]
          }
        }

        const seasonWinnersCount = {}
        const winnersQuery = await fetchDataAlpha()
        const { winners } = winnersQuery.data

        for (let i = 0; i < winners.length; i++) {
          if (!seasonWinnersCount[winners[i].season]) {
            seasonWinnersCount[winners[i].season] = 1
          } else {
            seasonWinnersCount[winners[i].season]++
          }
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
          if(!tx) {
            emitError(t('alpha_create_new_season_error'))
          } else {
            emitSuccess(t('confirmado'), 2000)
            fetchSeasonData()
          }
        }
      } else {
        emitError(t('alpha_season_authorization'), 2000)
      }
    } catch (e) {
      console.error({ e })
      stopLoading()
      emitError(t('alpha_create_new_season_error'))
    }
  }

  const showCards = (address, seasonName, isBuyingPack = true) => {
    try {
      checkPacks(alphaContract, seasonName)
        .then((res) => {
          if (res.length == 0) {
            setDisableTransfer(false)
          } else {
            setDisableTransfer(true)
          }
        })
        .catch((e) => {
          console.error({ e })
        })
      const cards = getUserCards(alphaContract, address, seasonName)
        .then((pack) => {
          if (pack.length) {
            const albumData = []
            const cardsData = []
            pack.forEach((card) => {
              card.class == 0 ? albumData.push(card) : cardsData.push(card)
            })
            setError('')
            setPack(pack)
            setAlbum(albumData)
            setAlbumCollection(ethers.BigNumber.from(albumData[0].collection).toNumber())
            const completion = ethers.BigNumber.from(albumData[0].completion).toNumber()
            setAlbumCompletion(completion)
            setVida(vidas[ethers.BigNumber.from(albumData[0].completion).toNumber()])
            getSeasonFolder(alphaContract, seasonName)
              .then((data) => {
                if (data == 'alpha_jsons') {
                  setSeasonFolder('T1')
                } else {
                  setSeasonFolder(data || 'UNKNOWN_FOLDER')
                }
                const baseUrl = `${storageUrlAlpha}/${seasonFolder || 'T1'}`
                if (completion < 5) {
                  setAlbumImage(`${baseUrl}/${albumData[0].number + '.png'}`)
                } else {
                  setAlbumImage(`${baseUrl}/${albumData[0].number + 'F.png'}`)
                  getWinners(alphaContract, seasonName)
                    .then((winners) => {
                      if (winners.includes(walletAddress)) {
                        setWinnerPosition(winners.indexOf(walletAddress) + 1)
                      }
                    })
                    .catch((e) => {
                      console.error({ e })
                    })
                }
              })
              .catch((e) => console.error({ e }))
            setCards(cardsData)
            setShowMain((prevShowMain) => !prevShowMain)
            return pack
          } else {
            !isBuyingPack &&
              Swal.fire({
                text: `${t('alpha_no_cards_error_text')}`,
                icon: 'error',
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
        })
        .catch((e) => {
          console.error({ e })
        })
      return cards
    } catch (ex) {
      console.error(ex)
    }
  }

  const handleBuyPack = async (price, name) => {
    try {
      const cards = await showCards(walletAddress, seasonName)
      setError('')

      if (cards && cards.length > 0) {
        emitSuccess(t('ya_tienes_cartas'), 2000)
        return
      }

      const packs = await checkPacks(alphaContract, name)
      if (!packs || packs.length == 0) {
        emitError(t('no_mas_packs'))
      } else {
        const balance = await checkBalance(daiContract, walletAddress)
        if (balance) {
          const approved = await checkApproved(daiContract, walletAddress, alphaContract.address)
          const comprarPack = async (price, name) => {
            startLoading()
            try {
              const pack = await alphaContract.buyPack(price, name, {
                gasLimit: 2500000
              })
              await pack.wait()
              stopLoading()
              return pack
            } catch (err) {
              console.error({ err })
              stopLoading()
              throw err
            }
          }

          if (approved) {
            try {
              const pack = await comprarPack(price, name)
              setPack(pack)
              await showCards(walletAddress, seasonName)
            } catch (err) {
              console.error({ err })
            }
          } else {
            startLoading()
            try {
              await authorizeDaiContract(
                daiContract,
                alphaContract.address,
                ethers.constants.MaxUint256
              )
              const pack = await comprarPack(price, name)
              setPack(pack)
              stopLoading()
              await showCards(walletAddress, seasonName)
            } catch (err) {
              console.error({ err })
              stopLoading()
            }
          }
        } else {
          emitError(t('no_dai'), 2000)
        }
      }
    } catch (err) {
      console.error({ err })
      stopLoading()
    }
  }

  const handlePasteCard = async (cardIndex) => {
    console.log({ cardIndex, cards, album })
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
          emitSuccess(t('album_completo'), 2000)
        } else {
          emitSuccess(t('carta_en_album'), 2000)
        }
        showCards(walletAddress, seasonName)
      }
    } catch (e) {
      console.error({ e })
      stopLoading()
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
        console.log({ tokenId })
        startLoading()
        const tx = await transferCard(alphaContract, walletAddress, result.value, tokenId)
        if (!tx) {
          stopLoading()
          emitError(t('alpha_transfer_card_error'))
        } else {
          stopLoading()
          emitSuccess(t('carta_enviada'), 2000)
        }
        showCards(walletAddress, seasonName)
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
                    >
                      {`${t('comprar_pack')} ($${packPrice?.substring(0, packPrice.length - 18)})`}
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
                <div className='alpha_album_container' onClick={() => alphaMidButton()}>
                  <CustomImage alt='alpha-album' src={albumImage} className='alpha_album' />
                </div>
                <div className='alpha_progress_container'>
                  <span>
                    {winnerPosition == 0
                      ? `${t('progreso')}: ${albumCompletion}/5`
                      : `${t('posicion')}: ${winnerPosition}`}
                  </span>
                  <img alt='vida' src={vida} />
                  <span>
                    {t('coleccion')}: {albumCollection}
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
                            <span className='alpha_card_collection'>C:{cardCollection}</span>
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

                {cards.length > 0 ? (
                  <div className='alpha_transfer_modal alpha_display_none'>
                    <button
                      className='alpha_transfer_modal_close alpha_modal_close'
                      onClick={() => {
                        const modal = document.getElementsByClassName('alpha_transfer_modal')[0]
                        modal.setAttribute('class', 'alpha_transfer_modal alpha_display_none')
                        setTransferError('')
                        setReceiverAccount('')
                      }}
                    >
                      X
                    </button>
                    <span
                      style={{
                        fontSize: '0.9rem'
                      }}
                    >
                      {t('carta_de_coleccion')}{' '}
                      {cards[cardIndex]
                        ? ethers.BigNumber.from(cards[cardIndex].collection).toNumber()
                        : ethers.BigNumber.from(cards[cardIndex - 1].collection).toNumber()}
                    </span>
                    <input
                      placeholder={t('wallet_destinatario')}
                      value={receiverAccount}
                      onChange={(e) => setReceiverAccount(e.target.value)}
                    />
                    <button
                      className='alpha_button'
                      onClick={() => handleTokenTransfer()}
                      // disabled={disableTransfer}
                    >
                      {t('transferir')}
                    </button>
                    <span className='alpha_transfer_error'>{transferError}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        )}

        <AlphaAlbums clickFromAlbums={clickFromAlbums} setSeasonName={setSeasonName} />
      </div>
    </div>
  )
}

export default AlphaMain
