import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import Web3Modal from 'web3modal'
import Swiper from 'swiper/bundle'
import Swal from 'sweetalert2'
import nofAbi from '../artifacts/contracts/NOF-SC.sol/NOF_Alpha'
import daiAbi from '../artifacts/contracts/TestDAI.sol/UChildDAI.json'
import vida0 from '../public/vida0.png'
import vida1 from '../public/vida1.png'
import vida2 from '../public/vida2.png'
import vida3 from '../public/vida3.png'
import vida4 from '../public/vida4.png'
import vida5 from '../public/vida5.png'
import marco from '../public/marco.png'
import reglas from '../public/reglas.png'

import { fetchData } from '../services/graph/alpha'
import AlphaAlbums from './AlphaAlbums'
import 'swiper/css/bundle'
import { storageUrl, CONTRACTS, NETWORK } from '../config'

const vidas = [
  vida0.src,
  vida1.src,
  vida2.src,
  vida3.src,
  vida4.src,
  vida5.src
]

let swiper //eslint-disable-line 

const AlphaCards = ({ loadAlbums, setLoadAlbums, alphaMidButton }) => {
  const [, setChainId] = useState(null)
  const [loading, setLoading] = useState(null)
  const [account, setAccount] = useState(null)
  const [nofContract, setNofContract] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [pack, setPack] = useState(null)
  const [album, setAlbum] = useState([])
  const [albumCard, setAlbumCard] = useState(null)
  const [albumCollection, setAlbumCollection] = useState(null)
  const [albumCompletion, setAlbumCompletion] = useState(null)
  const [isCollection, setIsCollection] = useState(false)
  const [cards, setCards] = useState([])
  const [noCardsError, setNoCardsError] = useState('')
  const [cardIndex, setCardIndex] = useState(0)
  const [vida, setVida] = useState(vida0.src)
  const [seasonNames, setSeasonNames] = useState(null)
  const [seasonName, setSeasonName] = useState('')
  const [packPrices, setPackPrices] = useState(null)
  const [packPrice, setPackPrice] = useState('')
  const [receiverAccount, setReceiverAccount] = useState(null)
  const [cardToTransfer, setCardToTransfer] = useState(null)
  const [winnerPosition, setWinnerPosition] = useState(0)
  const [transferError, setTransferError] = useState('')
  const [disableTransfer, setDisableTransfer] = useState(null)
  const [noMetamaskError, setNoMetamaskError] = useState('')
  const [seasonFolder, setSeasonFolder] = useState(null)
  // const [urls, setUrls] = useState([])

  async function requestAccount () {
    const web3Modal = new Web3Modal()
    let provider
    let address
    try {
      const connection = await web3Modal.connect()
      provider = new ethers.providers.Web3Provider(connection)
      address = await provider.getSigner().getAddress()
      setAccount(address)
      document.getElementsByClassName(
        'alpha_main_buttons_container'
      )[0].style.display = 'none'
    } catch (e) {
      console.error({ e })
    }

    if (!provider) return
    const chain = (await provider.getNetwork()).chainId
    setChainId(decToHex(chain))
    switchOrCreateNetwork(
      NETWORK.chainId,
      NETWORK.chainName,
      NETWORK.ChainRpcUrl,
      NETWORK.chainCurrency,
      NETWORK.chainExplorerUrl
    );
    return [provider, address]
  }

  function connectToMetamask () {
    if (window.ethereum !== undefined) {
      setNoMetamaskError('')
      requestAccount()
        .then((data) => {
          const [provider] = data
          const signer = provider.getSigner()
          const nofContractInstance = new ethers.Contract(
            CONTRACTS.alphaAddress,
            nofAbi.abi,
            signer
          )
          setNofContract(nofContractInstance)
          const daiContractInstance = new ethers.Contract(
            CONTRACTS.daiAddress,
            daiAbi.abi,
            signer
          )
          setDaiContract(daiContractInstance)
          requestSeasonData(nofContractInstance)
            /*  
            .then((data) => {
              const [currentSeason, currentPrice] = data
            })
            */
            .catch((e) => {
              console.error({ e })
            })
        })
        .catch((e) => {
          console.error({ e })
        })
    } else {
      setNoMetamaskError('Por favor instala Metamask para continuar.')
    }
  }

  function decToHex (number) {
    return `0x${parseInt(number).toString(16)}`
  }

  async function switchOrCreateNetwork (
    chainIdHex,
    chainName,
    rpcUrl,
    currency,
    explorer
  ) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }]
      })
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName,
                rpcUrls: [rpcUrl],
                nativeCurrency: {
                  name: currency,
                  symbol: currency,
                  decimals: 18
                },
                blockExplorerUrls: [explorer]
              }
            ]
          })
        } catch (e) {
          console.error(e.message)
        }
      }
    }
  }

  useEffect(() => {
    if (window && window.ethereum !== undefined) {
      window.ethereum.on('accountsChanged', () => {
        connectToMetamask()
      })

      window.ethereum.on('chainChanged', (newChain) => {
        setChainId(decToHex(newChain))
        connectToMetamask()
      })
    }
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const loadingElem = document.getElementById('loading')
    loading
      ? loadingElem.setAttribute('class', 'alpha_loader_container')
      : loadingElem.setAttribute(
        'class',
        'alpha_loader_container alpha_display_none'
      )
  }, [loading])

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
    const seasonNameElem =
      document.getElementsByClassName('alpha_season_name')[0]
    if (seasonName) {
      if (seasonName.length > 14) {
        seasonNameElem.style.fontSize = '0.7rem'
      }
      if (seasonName.length > 16) {
        seasonNameElem.style.fontSize = '0.6rem'
        seasonNameElem.innerText =
          seasonNameElem.innerText.substring(0, 16) + '...'
      }
    }
  }, [seasonName])

  async function requestSeasonData (contract) {
    const seasonData = await contract.getSeasonData()
    let currentSeason
    let currentPrice
    setLoading(true)
    for (let i = 0; i < seasonData[0].length; i++) {
      const season = await contract.getSeasonAlbums(seasonData[0][i])

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
    const winnersQuery = await fetchData()
    const { winners } = winnersQuery.data
    for (let i = 0; i < winners.length; i++) {
      if (!seasonWinnersCount[winners[i].season]) {
        seasonWinnersCount[winners[i].season] = 1
      } else {
        seasonWinnersCount[winners[i].season]++
      }
    }
    const finishedSeasons = Object.entries(seasonWinnersCount).filter(season => season[1] == 10).map(season => season[0])
    const activeSeasons = seasonData[0].filter(season => !finishedSeasons.includes(season))
    setSeasonName(currentSeason) // sets the season name as the oldest season with cards still available
    setPackPrice(currentPrice.toString()) // sets the season price as the last season price created
    setLoading(false)
    setSeasonNames(activeSeasons)
    setPackPrices(seasonData[1])

    return [currentSeason, currentPrice]
  }

  const getUserCards = async (address, seasonName) => {
    const cards = await nofContract.getCardsByUserBySeason(address, seasonName)
    return cards
  }

  const getSeasonFolder = async (seasonName) => {
    const response = await nofContract.seasons(seasonName)
    return response.folder
  }

  function emitSuccess (message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    })
  }

  const getWinners = async () => {
    const winners = await nofContract.getWinners(seasonName)
    return winners
  }

  const setValidAlbumCard = (imageName) => {
    // seasonFolder = 'T1'
    setAlbumCard(`${storageUrl}${seasonFolder}/${imageName}`)
  }

  const getCardImageUrl = (imageNumber) => {
    // seasonFolder = 'T1'
    return `${storageUrl}${seasonFolder}/${imageNumber}.png`
  }

  const getAlbumImageUrl = () => {
    return albumCard
  }


  const showCards = (address, seasonName) => {
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
        console.log('pack', pack)
        if (pack.length) {
          const albumData = []
          const cardsData = []
          pack.forEach((card) => {
            card.class == 0 ? albumData.push(card) : cardsData.push(card)
          })
          setNoCardsError('')
          setPack(pack)
          setAlbum(albumData)
          setAlbumCollection(
            ethers.BigNumber.from(albumData[0].collection).toNumber()
          )
          const completion = ethers.BigNumber.from(
            albumData[0].completion
          ).toNumber()
          setAlbumCompletion(completion)
          setVida(
            vidas[ethers.BigNumber.from(albumData[0].completion).toNumber()]
          )
          getSeasonFolder(seasonName)
            .then((data) => {
              if (data == 'alpha_jsons') {
                setSeasonFolder('T1')
              } else {
                setSeasonFolder(data || 'UNKNOWN_FOLDER')
              }
              if (completion < 5) {
                setValidAlbumCard(albumData[0].number + '.png')
              } else {
                setValidAlbumCard(albumData[0].number + 'F' + '.png')
                getWinners()
                  .then((winners) => {
                    if (winners.includes(account)) {
                      setWinnerPosition(winners.indexOf(account) + 1)
                    }
                  })
                  .catch((e) => {
                    console.error({ e })
                  })
              }
            })
            .catch((e) => console.error({ e }))
          setCards(cardsData)
          document.getElementById('alpha_show_cards_button').style.display =
            'none'
          document.getElementById('alpha_buy_pack_button').style.display =
            'none'
          document.getElementById('alpha_select_season_button').style.display =
            'none'
          const container = document.getElementsByClassName(
            'alpha_inner_container'
          )[0]
          container.setAttribute(
            'class',
            'alpha_inner_container alpha_inner_container_open'
          )
          return pack
        } else {
          setNoCardsError('Necesitas comprar un pack, primero.')
        }
      })
      .catch((e) => {
        console.error({ e })
      })
    return cards
  }

  const authorizeDaiContract = async () => {
    const authorization = await daiContract.approve(
      CONTRACTS.alphaAddress,
      ethers.constants.MaxUint256,
      { gasLimit: 2500000 }
    )
    setLoading(true)
    await authorization.wait()
    setLoading(false)
    return authorization
  }

  const checkApproved = async (approvedAddress, tokenOwner) => {
    const approved = await daiContract.allowance(tokenOwner, approvedAddress)
    return approved.gt(0)
  }

  const checkPacks = async () => {
    const check = await nofContract.getSeasonAlbums(seasonName)
    return check
  }

  /**
This function checks the balance of a specified account on the Dai contract and returns whether it meets a minimum value.
@async
@function
@returns {boolean} - True if the account balance is greater than the minimum value, false otherwise.
*/
  const checkBalance = async () => {
    // Get the account balance from the Dai contract
    const balance = await daiContract.balanceOf(account)
    // Convert the balance from a BigNumber to a number
    const number = JSON.parse(ethers.BigNumber.from(balance).toString())

    // Set the minimum balance value to 1 Dai
    const minimum = 1000000000000000000

    // Return true if the account balance is greater than the minimum value, false otherwise
    return number > minimum
  }

  const buyPack = (price, name) => {
    showCards(account, seasonName)
      .then((cards) => {
        setNoCardsError('')
        if (cards && cards.length > 0) {
          emitSuccess('Ya tienes cartas.')
          return
        }
        checkPacks()
          .then((res) => {
            if (!res || res.length == 0) {
              setNoCardsError('No hay más packs disponibles.')
            } else {
              if (checkBalance(account)) {
                checkApproved(CONTRACTS.alphaAddress, account)
                  .then((res) => {
                    const comprarPack = async (price, name) => {
                      const pack = await nofContract.buyPack(price, name, {
                        gasLimit: 2500000
                      })
                      setLoading(true)
                      await pack.wait()
                      setLoading(false)
                      return pack
                    }
                    if (res) {
                      comprarPack(price, name)
                        .then((pack) => {
                          setPack(pack)
                          showCards(account, seasonName)
                        })
                        .catch((err) => {
                          console.error({ err })
                          setLoading(false)
                        })
                    } else {
                      authorizeDaiContract()
                        .then(() => {
                          comprarPack(price, name)
                            .then((pack) => {
                              setPack(pack)
                              showCards(account, seasonName)
                            })
                            .catch((e) => {
                              console.error({ e })
                              setLoading(false)
                            })
                        })
                        .catch((e) => {
                          console.error({ e })
                          setLoading(false)
                        })
                    }
                  })
                  .catch((e) => {
                    console.error({ e })
                    setLoading(false)
                  })
              } else {
                Swal.fire({
                  title: 'oops!',
                  text: 'No tienes suficientes DAI!',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 1500
                })
              }
            }
          })
          .catch((e) => {
            console.error({ e })
            setLoading(false)
          })
      })
      .catch((e) => {
        console.error({ e })
        setLoading(false)
      })
  }

  const getAlbumData = async (tokenId) => {
    const albumData = await nofContract.cards(tokenId)
    return albumData
  }

  const pasteCard = (cardIndex) => {
    const pegarCarta = async (cardIndex) => {
      const tokenId = ethers.BigNumber.from(
        cards[cardIndex].tokenId
      ).toNumber()
      const albumTokenId = ethers.BigNumber.from(album[0].tokenId).toNumber()
      const paste = await nofContract.pasteCards(tokenId, albumTokenId, {
        gasLimit: 2500000
      })
      setLoading(true)
      await paste.wait()
      setLoading(false)
      return albumTokenId
    }
    pegarCarta(cardIndex)
      .then((tokenId) => {
        showCards(account, seasonName)
        getAlbumData(tokenId).then((res) => {
          if (res.completion == 5) {
            emitSuccess('Felicidades! Has completado el album!')
          } else {
            emitSuccess('Tu carta ya está en el album')
          }
        })
      })
      .catch((e) => {
        console.error({ e })
      })
  }

  const checkInputAddress = () => {
    const hexa = '0123456789abcdefABCDEF'
    if (
      receiverAccount.length !== 42 ||
      receiverAccount[0] !== '0' ||
      receiverAccount[1] !== 'x'
    ) {
      setTransferError('La dirección de destino es inválida.')
      return false
    }
    for (let i = 2; i < receiverAccount.length; i++) {
      if (!hexa.includes(receiverAccount[i])) {
        setTransferError('La dirección de destino es inválida.')
        return false
      }
    }
    return true
  }

  async function transferToken () {
    try {
      if (checkInputAddress(receiverAccount)) {
        setTransferError('')
        const transaction = await nofContract[
          'safeTransferFrom(address,address,uint256)'
        ](account, receiverAccount, cardToTransfer)
        const modal = document.getElementsByClassName(
          'alpha_transfer_modal'
        )[0]
        modal.setAttribute('class', 'alpha_transfer_modal alpha_display_none')
        setLoading(true)
        await transaction.wait()
        showCards(account, seasonName)
        setReceiverAccount('')
        setLoading(false)
        emitSuccess('Tu carta ha sido enviada')
      }
    } catch (e) {
      console.error({ e })
      if (e.reason.includes('Receiver is not playing this season')) {
        setTransferError('Este usuario no está jugando esta temporada.')
      }
    }
  }

  const showRules = () => {
    document.getElementsByClassName(
      'alpha_main_buttons_container'
    )[0].style.display = 'none'
    document.getElementsByClassName('alpha_rules_container')[0].style.display =
      'block'
    window.addEventListener('keydown', (e) => {
      if (e.code == 'Escape') {
        document.getElementsByClassName(
          'alpha_rules_container'
        )[0].style.display = 'none'
        document.getElementsByClassName(
          'alpha_main_buttons_container'
        )[0].style.display = 'flex'
      }
    })
  }

  const closeRules = () => {
    document.getElementsByClassName(
      'alpha_main_buttons_container'
    )[0].style.display = 'flex'
    document.getElementsByClassName('alpha_rules_container')[0].style.display =
      'none'
  }

  return (
    <div className='alpha'>
      <div className='alpha_loader_container alpha_display_none' id='loading'>
        <span className='loader' />
      </div>
      <div className='alpha_main_buttons_container'>
        <button
          className='alpha_button alpha_main_button'
          id='connect_metamask_button'
          onClick={() => connectToMetamask()}
        >
          Conectar con Metamask
        </button>
        <button
          className='alpha_button alpha_main_button'
          id='show_rules_button'
          onClick={() => showRules()}
        >
          Reglas
        </button>
        <span>{noMetamaskError}</span>
      </div>
      <div className='alpha_rules_container'>
        <button
          className='alpha_rules_img_close alpha_modal_close'
          onClick={() => closeRules()}
        >
          X
        </button>
        <img alt='alpha-rules' className='alpha_rules_img' src={reglas.src} tabIndex='0' />
      </div>

      {account && (
        <div className='alpha_inner_container'>
          <div className='alpha_data'>
            <div className='alpha_season'>
              <img alt='marco' src={marco.src} />
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
                  seasonNames.map((name) => <option key={name}>{name}</option>)}
              </select>
            </div>
            <div className='alpha_start_buttons'>
              <button
                onClick={() => showCards(account, seasonName)}
                className='alpha_button'
                id='alpha_show_cards_button'
              >
                Ver cartas
              </button>
              <button
                onClick={() => buyPack(packPrice, seasonName)}
                className='alpha_button'
                id='alpha_buy_pack_button'
              >{`Comprar Pack ($${packPrice.substring(
                0,
                packPrice.length - 18
              )})`}
              </button>
            </div>
            <span
              style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}
            >
              {noCardsError}
            </span>
          </div>

          {pack && pack.length ? (
            <div className='alpha_container'>
              <div className='alpha_album_container'>
                <img alt='alpha-album' src={getAlbumImageUrl()} className='alpha_album' />
              </div>
              <div className='alpha_progress_container'>
                <span>
                  {winnerPosition == 0
                    ? `Progreso: ${albumCompletion}/5`
                    : `Posición: ${winnerPosition}`}
                </span>
                <img alt='vida' src={vida} />
                <span>Colección: {albumCollection}</span>
                <div className='alpha_progress_button_container'>
                  <button
                    className='alpha_button'
                    onClick={() => pasteCard(cardIndex)}
                    disabled={!isCollection}
                  >
                    PEGAR
                  </button>
                  <button
                    className='alpha_button'
                    onClick={() => {
                      setCardToTransfer(
                        ethers.BigNumber.from(
                          cards[cardIndex].tokenId
                        ).toNumber()
                      )
                      const modal = document.getElementsByClassName(
                        'alpha_transfer_modal'
                      )[0]
                      modal.setAttribute('class', 'alpha_transfer_modal')
                    }}
                    disabled={!(cards.length > 0)}
                  >
                    TRANSFERIR
                  </button>
                </div>
              </div>
              <div className='alpha_cards_container'>
                <div className='swiper-container alpha-swiper-container'>
                  <div className='swiper-wrapper alpha-swiper-wrapper'>
                    {cards.map((card) => {
                      const cardCollection = ethers.BigNumber.from(
                        card.collection
                      ).toNumber()
                      return (
                        <div
                          style={{ backgroundImage: 'none', paddingTop: '0' }}
                          className='swiper-slide alpha-swiper-slide'
                          key={ethers.BigNumber.from(card.tokenId).toNumber()}
                        >
                          <span className='alpha_card_collection'>
                            C:{cardCollection}
                          </span>
                          <img
                            alt='img'
                            src={getCardImageUrl(card.number)}
                            className='alpha_card'
                          />
                        </div>
                      )
                    })}
                  </div>
                  <div className='swiper-pagination' />
                </div>

              </div>

              {cards.length > 0
                ? (
                  <div className='alpha_transfer_modal alpha_display_none'>
                    <button
                      className='alpha_transfer_modal_close alpha_modal_close'
                      onClick={() => {
                        const modal = document.getElementsByClassName(
                          'alpha_transfer_modal'
                        )[0]
                        modal.setAttribute(
                          'class',
                          'alpha_transfer_modal alpha_display_none'
                        )
                        setTransferError('')
                        setReceiverAccount('')
                      }}
                    >
                      X
                    </button>
                    <span style={{ fontSize: '0.9rem' }}>
                      Carta de colección{' '}
                      {cards[cardIndex]
                        ? ethers.BigNumber.from(
                          cards[cardIndex].collection
                        ).toNumber()
                        : ethers.BigNumber.from(
                          cards[cardIndex - 1].collection
                        ).toNumber()}
                    </span>
                    <input
                      placeholder='Inserte la wallet del destinatario'
                      value={receiverAccount}
                      onChange={(e) => setReceiverAccount(e.target.value)}
                    />
                    <button
                      className='alpha_button'
                      onClick={() => transferToken()}
                      disabled={disableTransfer}
                    >

                      TRANSFERIR
                    </button>
                    <span className='alpha_transfer_error'>{transferError}</span>
                  </div>
                  )
                : null}
            </div>
          ) : null}
        </div>
      )}
      <AlphaAlbums
        alphaMidButton={alphaMidButton}
        setLoadAlbums={setLoadAlbums}
        setSeasonName={setSeasonName}
        loadAlbums={loadAlbums}
        storageUrl={storageUrl}
        nofContract={nofContract}
        seasonNames={seasonNames}
        account={account}
        getSeasonFolder={getSeasonFolder}
        marco={marco}
      />
    </div>
  )
}

AlphaCards.propTypes = {
  loadAlbums: PropTypes.bool,
  setLoadAlbums: PropTypes.func,
  alphaMidButton: PropTypes.func
}

export default AlphaCards
