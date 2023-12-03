import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import 'swiper/css/bundle'
import Swiper from 'swiper/bundle'
import AlphaAlbums from './AlphaAlbums'
import Rules from '../Common/Rules'
import { storageUrlAlpha, CONTRACTS } from '../../config'
import { fetchDataAlpha } from '../../services/alpha'
import { checkApproved } from '../../services/dai'
import CustomImage from '../../components/CustomImage'
import { emitError, emitSuccess } from '../../utils/alert'

import { useTranslation } from 'next-i18next'
import { useWeb3Context } from '../../hooks'
import { useLayoutContext } from '../../hooks'
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
  const { walletAddress, daiContract, alphaContract, noMetamaskError, connectWallet } =
    useWeb3Context()
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
      if (!walletAddress || !alphaContract || !seasonNames) return
      startLoading()

      let albumsArr = []
      for (let i = 0; i < seasonNames.length; i++) {
        const album = await alphaContract.getCardsByUserBySeason(walletAddress, seasonNames[i])
        for (let j = 0; j < album.length; j++) {
          if (album[j].class == 0) {
            const folder = await getSeasonFolder(album[j].season)
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

  const fetchSeasonData = async () => {
    try {
      if (!walletAddress || !alphaContract) return
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
        setSeasonName(currentSeason) // sets the season name as the oldest season with cards still available
        setPackPrice(currentPrice?.toString()) // sets the season price as the last season price created
        setSeasonNames(activeSeasons)

        if (!activeSeasons || activeSeasons.length === 0) {
          setError(t('no_season_nampes'))
        }

        setPackPrices(seasonData[1])
      }
      stopLoading()
    } catch (ex) {
      stopLoading()
      console.error(ex)
      emitError(t('alpha_fetch_season_data_error'))
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [walletAddress, albums]) //eslint-disable-line react-hooks/exhaustive-deps

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

  useEffect(() => {
    fetchSeasonData()
  }, [walletAddress, alphaContract]) //eslint-disable-line react-hooks/exhaustive-deps

  const getUserCards = async (address, seasonName) => {
    try {
      const cards = await alphaContract.getCardsByUserBySeason(address, seasonName)
      return cards
    } catch (ex) {
      console.error(ex)
    }
  }

  const getSeasonFolder = async (seasonName) => {
    try {
      const response = await alphaContract.seasons(seasonName)
      return response.folder
    } catch (ex) {
      console.error(ex)
    }
  }

  const getWinners = async () => {
    try {
      const winners = await alphaContract.getWinners(seasonName)
      return winners
    } catch (ex) {
      console.error(ex)
    }
  }

  const authorizeDaiContract = async () => {
    try {
      const authorization = await daiContract.approve(
        CONTRACTS.alphaAddress,
        ethers.constants.MaxUint256,
        { gasLimit: 2500000 }
      )
      await authorization.wait()
      return authorization
    } catch (ex) {
      console.error(ex)
    }
  }

  const checkPacks = async () => {
    try {
      const check = await alphaContract.getSeasonAlbums(seasonName)
      return check
    } catch (ex) {
      console.error(ex)
    }
  }

  const checkBalance = async () => {
    const balance = await daiContract.balanceOf(walletAddress)
    const number = JSON.parse(ethers.BigNumber.from(balance).toString())
    const minimum = 1000000000000000000 // Set the minimum balance value to 1 Dai
    return number > minimum // True if the walletAddress balance is greater than the minimum value
  }

  const getAlbumData = async (tokenId) => {
    const albumData = await alphaContract.cards(tokenId)
    return albumData
  }

  const showCards = (address, seasonName) => {
    try {
      checkPacks()
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
      const cards = getUserCards(address, seasonName)
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
            getSeasonFolder(seasonName)
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
                  getWinners()
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
            setError(t('necesitas_comprar_pack'))
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

  const buyPack = (price, name) => {
    showCards(walletAddress, seasonName)
      .then((cards) => {
        setError('')
        if (cards && cards.length > 0) {
          emitSuccess(t('ya_tienes_cartas'), 2000)
          return
        }
        checkPacks()
          .then((res) => {
            if (!res || res.length == 0) {
              setError(t('no_mas_packs'))
            } else {
              if (checkBalance(walletAddress)) {
                checkApproved(daiContract, walletAddress, CONTRACTS.alphaAddress)
                  .then((res) => {
                    const comprarPack = async (price, name) => {
                      const pack = await alphaContract.buyPack(price, name, {
                        gasLimit: 2500000
                      })
                      startLoading()
                      await pack.wait()
                      stopLoading()
                      return pack
                    }
                    if (res) {
                      comprarPack(price, name)
                        .then((pack) => {
                          setPack(pack)
                          showCards(walletAddress, seasonName)
                        })
                        .catch((err) => {
                          console.error({ err })
                          stopLoading()
                        })
                    } else {
                      authorizeDaiContract()
                        .then(() => {
                          comprarPack(price, name)
                            .then((pack) => {
                              setPack(pack)
                              showCards(walletAddress, seasonName)
                            })
                            .catch((e) => {
                              console.error({ e })
                              stopLoading()
                            })
                        })
                        .catch((e) => {
                          console.error({ e })
                          stopLoading()
                        })
                    }
                  })
                  .catch((e) => {
                    console.error({ e })
                    stopLoading()
                  })
              } else {
                emitError(t('no_dai'), 2000)
              }
            }
          })
          .catch((e) => {
            console.error({ e })
            stopLoading()
          })
      })
      .catch((e) => {
        console.error({ e })
        stopLoading()
      })
  }

  const pasteCard = (cardIndex) => {
    try {
      startLoading()
      const pegarCarta = async (cardIndex) => {
        const tokenId = ethers.BigNumber.from(cards[cardIndex].tokenId).toNumber()
        const albumTokenId = ethers.BigNumber.from(album[0].tokenId).toNumber()
        const paste = await alphaContract.pasteCards(tokenId, albumTokenId, {
          gasLimit: 2500000
        })
        await paste.wait()
        return albumTokenId
      }
      pegarCarta(cardIndex)
        .then((tokenId) => {
          showCards(walletAddress, seasonName)
          getAlbumData(tokenId).then((res) => {
            if (res.completion == 5) {
              emitSuccess(t('album_completo'))
            } else {
              emitSuccess(t('carta_en_album'))
            }
          })
        })
        .catch((e) => {
          console.error({ e })
        })
      stopLoading()
    } catch (ex) {
      stopLoading()
      console.error(ex)
    }
  }

  async function transferToken() {
    try {
      if (checkInputAddress(receiverAccount, walletAddress)) {
        setTransferError('')
        const transaction = await alphaContract['safeTransferFrom(address,address,uint256)'](
          walletAddress,
          receiverAccount,
          cardToTransfer
        )
        const modal = document.getElementsByClassName('alpha_transfer_modal')[0]
        modal.setAttribute('class', 'alpha_transfer_modal alpha_display_none')
        startLoading()
        await transaction.wait()
        showCards(walletAddress, seasonName)
        setReceiverAccount('')
        stopLoading()
        emitSuccess(t('carta_enviada'))
      } else {
        setTransferError(t('direccion_destino_error'))
      }
    } catch (e) {
      stopLoading()
      console.error({ e })
      if (e.reason.includes('Receiver is not playing this season')) {
        setTransferError(t('usuario_no_en_temporada'))
      }
    }
  }

  return (
    <div className='alpha_main'>
      <div className='alpha'>
        {!walletAddress && (
          <div className='main_buttons_container'>
            <button
              className='alpha_button alpha_main_button'
              id='connect_wallet_button'
              onClick={() => connectWallet()}
            >
              {t('connect_wallet')}
            </button>
            <button
              className='alpha_button alpha_main_button'
              id='show_rules_button'
              onClick={() => setShowRules(true)}
            >
              {t('reglas')}
            </button>
            <span>{noMetamaskError}</span>
          </div>
        )}

        {showRules && <Rules type='alpha' setShowRules={setShowRules} />}

        {walletAddress && alphaContract && seasonNames && (
          <div
            className={
              showMain
                ? 'alpha_inner_container alpha_inner_container_open'
                : 'alpha_inner_container'
            }
          >
            <div className='alpha_data'>
              {seasonNames && seasonNames.length > 0 && !showMain && (
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
                      {seasonNames && seasonNames.map((name) => <option key={name}>{name}</option>)}
                    </select>
                  </div>
                  <div className='alpha_start_buttons'>
                    <button
                      onClick={() => showCards(walletAddress, seasonName)}
                      className='alpha_button'
                      id='alpha_show_cards_button'
                    >
                      {t('ver_cartas')}
                    </button>
                    <button
                      onClick={() => buyPack(packPrice, seasonName)}
                      className='alpha_button'
                      id='alpha_buy_pack_button'
                    >
                      {`${t('comprar_pack')} ($${packPrice?.substring(0, packPrice.length - 18)})`}
                    </button>
                  </div>
                </>
              )}
              <span
                style={{
                  color: 'red',
                  textAlign: 'center',
                  marginTop: '10px'
                }}
              >
                {error}
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
                      onClick={() => pasteCard(cardIndex)}
                      disabled={!isCollection}
                    >
                      {t('pegar')}
                    </button>
                    <button
                      className='alpha_button'
                      onClick={() => {
                        setCardToTransfer(
                          ethers.BigNumber.from(cards[cardIndex].tokenId).toNumber()
                        )
                        const modal = document.getElementsByClassName('alpha_transfer_modal')[0]
                        modal.setAttribute('class', 'alpha_transfer_modal')
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
                      onClick={() => transferToken()}
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
