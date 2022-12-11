import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import Swiper from 'swiper/bundle';
import Swal from 'sweetalert2'
import nofAbi from "../artifacts/contracts/NOF-SC.sol/NOF_Alpha";
import daiAbi from "../artifacts/contracts/TestDAI.sol/Dai.json";
import vida0 from "../public/vida0.png"
import vida1 from "../public/vida1.png"
import vida2 from "../public/vida2.png"
import vida3 from "../public/vida3.png"
import vida4 from "../public/vida4.png"
import vida5 from "../public/vida5.png"
import marco from "../public/marco.png"

const vidas = [vida0.src, vida1.src, vida2.src, vida3.src, vida4.src, vida5.src];

import 'swiper/css/bundle';

const storageUrl = "https://storage.googleapis.com/hunterspride/NOFJSON/T1/"; // 1.png to 60.png
const contractAddress = "0x8F0784f7A7919C8420B7a06a44891430deA0e079"; // test contract mumbai network
const daiAddress = "0xF995C0BB2f4F2138ba7d78F2cFA7D3E23ce05615"; // test dai contract with unlimited minting

const AlphaCards = () => {
  const validChainId = "0x13881";
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(null)
  const [account, setAccount] = useState(null);
  const [nofContract, setNofContract] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [pack, setPack] = useState(null)
  const [album, setAlbum] = useState([])
  const [albumCard, setAlbumCard] = useState(null)
  const [albumCollection, setAlbumCollection] = useState(null)
  const [albumCompletion, setAlbumCompletion] = useState(null)
  const [isCollection, setIsCollection] = useState(false)
  const [cards, setCards] = useState([])
  const [noCardsError, setNoCardsError] = useState("")
  const [cardIndex, setCardIndex] = useState(0)
  const [vida, setVida] = useState(vida0.src)
  const [packPrice, setPackPrice] = useState("")
  const [seasonName, setSeasonName] = useState("")
  const [receiverAccount, setReceiverAccount] = useState(null)
  const [cardToTransfer, setCardToTransfer] = useState(null)

  async function requestAccount() {
    const web3Modal = new Web3Modal();
    let provider;
    let address;
    try {
      const connection = await web3Modal.connect();
      provider = new ethers.providers.Web3Provider(connection);
      address = await provider.getSigner().getAddress();
      setAccount(address);
    } catch (e) {
      console.log("requestAccount error:", e);
    }

    if (!provider) return;
    const chain = (await provider.getNetwork()).chainId;
    setChainId(decToHex(chain));

    const chainName = "Mumbai";
    const rpcUrl = "https://rpc-mumbai.maticvigil.com";
    const currency = "MATIC";
    const explorer = "https://mumbai.polygonscan.com/";
    switchOrCreateNetwork(validChainId, chainName, rpcUrl, currency, explorer);
    return [provider, address];
  }

  async function requestSeasonData(contract) {
    const seasonData = await contract.getSeasonData();
    const currentSeason = seasonData[0][seasonData[0].length - 1];
    const currentPrice = seasonData[1][seasonData[1].length - 1];
    setSeasonName(currentSeason); // sets the season name as the last season name created
    setPackPrice(currentPrice.toString()); // sets the season price as the last season price created
    return [currentSeason, currentPrice];
  }

  const getUserCards = async (address, seasonName) => {
    const cards = await nofContract.getCardsByUserBySeason(address, seasonName);
    return cards
  }

  function emitError(error) {
    Swal.fire({
      title: 'Error!',
      text: error,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }

  function emitSuccess(message) {
    Swal.fire({
      title: '',
      text: message,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    })
  }

  const showCards = (address, seasonName) => {
    const cards = getUserCards(address, seasonName)
      .then(pack => {
        if(pack.length){
          let album = []
          let cards = []
          pack.forEach(card => {
            card.class == 0 ? album.push(card) : cards.push(card);
          })
          setPack(pack)
          setAlbum(album)
          setAlbumCollection(ethers.BigNumber.from(album[0].collection).toNumber())
          const completion = ethers.BigNumber.from(album[0].completion).toNumber()
          setAlbumCompletion(completion)
          setVida(vidas[ethers.BigNumber.from(album[0].completion).toNumber()])
          if(completion < 5){
            setAlbumCard(storageUrl + album[0].number + ".png")
          } else {
            setAlbumCard(storageUrl + album[0].number + "F" + ".png")
          }
          setCards(cards)
          document.getElementById("alpha_show_cards_button").style.display = "none"
          document.getElementById("alpha_buy_pack_button").style.display = "none"
          return pack
        } else {
          setNoCardsError("Necesitas comprar un pack, primero.")
        }
      })
      .catch(e => {
        console.log({ e })
      })
      return cards
  }

  const authorizeDaiContract = async () => {
    const authorization = await daiContract.approve(contractAddress, packPrice)
    setLoading(true)
    await authorization.wait()
    setLoading(false)
    console.log(authorization)
    return authorization
  }

  const checkApproved = async (approvedAddress, tokenOwner) => {
    const approved = await daiContract.allowance(tokenOwner, approvedAddress);
    return approved.gt(0);
  }

  const buyPack = (price, name) => {
    showCards(account, seasonName)
    .then((cards) => {
      setNoCardsError("")
      if(cards && cards.length > 0){
        emitSuccess("Ya tienes cartas.")
        return
      }
      checkApproved(contractAddress, account)
        .then(res => {
        const comprarPack = async (price, name) => {
        const pack = await nofContract.buyPack(price, name)
        setLoading(true)
        await pack.wait()
        setLoading(false)
        return pack
      }
      if(res){
        comprarPack(price, name)
          .then(pack => {
            setPack(pack)
            showCards(account, seasonName)
          })
          .catch(e => {
            console.log({ e })
          })
      } else {
        authorizeDaiContract()
          .then(() => {
            comprarPack(price, name)
          .then(pack => {
            setPack(pack)
            showCards(account, seasonName)
          })
          .catch(e => {
            console.log({ e })
            setLoading(false)
          })
        })
          .catch(e => {
            console.log({ e })
          })
        }
      })
    .catch(e => {
      console.log({ e })
    })
    })
    .catch(e => {
      console.log({ e })
    })
  }

  const pasteCard = (cardIndex) => {
    const pegarCarta = async (cardIndex) => {
      const tokenId = ethers.BigNumber.from(cards[cardIndex].tokenId).toNumber()
      const albumTokenId = ethers.BigNumber.from(album[0].tokenId).toNumber()
      const paste = await nofContract.pasteCards(tokenId, albumTokenId)
      setLoading(true)
      await paste.wait()
      setLoading(false)
    }
    pegarCarta(cardIndex)
      .then(() => {
        showCards(account, seasonName)
        emitSuccess("Tu carta ya está en el album")
      })
      .catch(e => {
        console.log({ e })
      })
  }

  const checkInputAddress = (address) => {
    const hexa = "0123456789abcdefABCDEF";
    console.log(address)
    if (
      receiverAccount.length !== 42 ||
      receiverAccount[0] !== "0" ||
      receiverAccount[1] !== "x"
    ) {
      emitError("La dirección de destino es inválida.")
      return false;
    }
    for (let i = 2; i < receiverAccount.length; i++) {
      if (!hexa.includes(receiverAccount[i])) {
        emitError("La dirección de destino es inválida.")
        return false;
      }
    }
    return true
  };

  async function transferToken() {
    try {
      if (checkInputAddress(receiverAccount)) {
        const transaction = await nofContract[
          "safeTransferFrom(address,address,uint256)"
        ](account, receiverAccount, cardToTransfer);
        const modal = document.getElementsByClassName("alpha_transfer_modal")[0];
        modal.setAttribute("class", "alpha_transfer_modal alpha_display_none");
        setLoading(true);
        await transaction.wait();
        showCards(account, seasonName);
        setReceiverAccount("")
        setLoading(false);
        emitSuccess("Tu carta ha sido enviada")
      }
    } catch (e) {
      console.log({ e })
    }
  }

  const albumCompleted = () => {
    const album = document.getElementsByClassName("alpha_album")[0]
    console.log(album)
  }

  function decToHex(number) {
    return `0x${parseInt(number).toString(16)}`;
  }

  async function switchOrCreateNetwork(
    chainIdHex,
    chainName,
    rpcUrl,
    currency,
    explorer
  ) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: chainName,
                rpcUrls: [rpcUrl],
                nativeCurrency: {
                  name: currency,
                  symbol: currency,
                  decimals: 18,
                },
                blockExplorerUrls: [explorer],
              },
            ],
          });
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  }

  useEffect(() => {
    console.log({albumCompleted})
    if(window && window.ethereum !== undefined){
      window.ethereum.on('accountsChanged', (accounts) => {
        const address = accounts[0]
        setAccount(address)
      })
  
      window.ethereum.on('chainChanged', newChain => {
        setChainId(decToHex(newChain))
      })
    }
    requestAccount().then((data) => {
      const [provider, address] = data;
      const signer = provider.getSigner();
      let nofContractInstance = new ethers.Contract(
        contractAddress,
        nofAbi.abi,
        signer
      );
      setNofContract(nofContractInstance)
      let daiContractInstance = new ethers.Contract(
        daiAddress,
        daiAbi.abi,
        signer
      );
      setDaiContract(daiContractInstance)
      requestSeasonData(nofContractInstance)
      .then(data => {
        const [currentSeason, currentPrice] = data;
      })
      .catch(e => {
        console.log({e})
      });
    })
    .catch(e => {
      console.log({e})
    });
  }, []);

  useEffect(() => {
    const loadingElem = document.getElementById("loading");
    loading
      ? loadingElem.setAttribute("class", "alpha_loader_container")
      : loadingElem.setAttribute(
          "class",
          "alpha_loader_container alpha_display_none"
        );
  }, [loading]);

  let swiper;

  useEffect(() => {
    swiper = new Swiper('.swiper-container', {
      effect: 'cards',
      grabCursor: true,
      centeredSlides: true,
      setWrapperSize: true,
      slidesPerView: 1,
      initialSlide: 0,
      runCallbacksOnInit: true,
      cardsEffect: {
        perSlideOffset: 8,
        slideShadows: false,
      },
      pagination: {
        el: '.swiper-pagination',
      },
    });
    
    swiper.on('slideChange', res => {
      setCardIndex(res.activeIndex)

      if(cards[res.activeIndex].collection == albumCollection){
        setIsCollection(true)
      } else {
        setIsCollection(false)
      }
    });
  }, [pack])

  useEffect(() => {
    const seasonNameElem = document.getElementsByClassName('alpha_season_name')[0];
    if(seasonName.length > 14){
      seasonNameElem.style.fontSize = "0.7rem"
    }
    if(seasonName.length > 16){
      seasonNameElem.style.fontSize = "0.6rem"
      seasonNameElem.innerText = seasonNameElem.innerText.substring(0,16) + "..."
    }
  }, [seasonName])

  return (
    <div className="alpha">
      <div className="alpha_loader_container alpha_display_none" id="loading">
        <span
          className="loader"
        ></span>
      </div>
      {account && (
        <div className="alpha_inner_container">
          <div className="alpha_data">
            {/* <div className="alpha_account">Hola,{" "}
            {account &&
              account.substring(0, 6) +
                "..." +
                account.substring(37, account.length - 1)}
            !</div> */}
            <div className="alpha_season">
              <img src={marco.src}/>
              <span className="alpha_season_name">{seasonName}</span>
            </div>
            <div className="alpha_start_buttons">
              <button onClick={() => showCards(account, seasonName)} className="alpha_button" id="alpha_show_cards_button">Ver cartas</button>
              <button onClick={() => buyPack(packPrice, seasonName)} className="alpha_button" id="alpha_buy_pack_button">{`Comprar Pack ($${packPrice.substring(0,packPrice.length - 18)})`}</button>
            </div>
            <span style={{"color":"red"}}>{noCardsError}</span>
          </div>
      
          {pack && pack.length ? (
          <div className="alpha_container">
          
            
              <div className="alpha_album_container">
                <img
                  src={albumCard}
                  className="alpha_album"
                />
              </div>
              <div className="alpha_progress_container">
                <span>Progreso: {albumCompletion}/5</span>
                <img src={vida} />
                <span>Colección: {albumCollection}</span>
                <div className="alpha_progress_button_container">
                  <button
                    className="alpha_button"
                    onClick={() =>
                      pasteCard(cardIndex)
                    }
                    disabled={!isCollection}
                  >
                    PEGAR
                  </button>
                  <button
                    className="alpha_button"
                    onClick={() => {
                      setCardToTransfer(ethers.BigNumber.from(cards[cardIndex].tokenId).toNumber());
                      const modal = document.getElementsByClassName(
                        "alpha_transfer_modal"
                      )[0];
                      modal.setAttribute(
                        "class",
                        "alpha_transfer_modal"
                      );
                    }}
                  >
                    TRANSFERIR
                  </button>
                </div>
              </div>
              <div className="alpha_cards_container">
                <div className="swiper-container">
                  <div className="swiper-wrapper">
                    {cards.map((card, i) => {
                      const cardCollection = ethers.BigNumber.from(card.collection).toNumber()
                      return (
                        <div className="swiper-slide" key={i}>
                          <span className="alpha_card_collection">C:{cardCollection}</span>
                          <img
                            src={storageUrl + card.number + ".png"}
                            className="alpha_card"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="swiper-pagination"></div>
                </div>
              
              </div>
          
            
              <div className="alpha_transfer_modal alpha_display_none">
                <button className="alpha_transfer_modal_close" onClick={() => {
                  const modal = document.getElementsByClassName('alpha_transfer_modal')[0]
                  return modal.setAttribute('class', "alpha_transfer_modal alpha_display_none")
                }}>X</button>
                <span style={{"fontSize":"0.9rem"}}>Carta de colección {cards && ethers.BigNumber.from(cards[cardIndex].collection).toNumber()}</span>
                <input
                  placeholder="Inserte la wallet del destinatario"
                  value={receiverAccount}
                  onChange={(e) => setReceiverAccount(e.target.value)}
                />
                <button className="alpha_button" onClick={() => transferToken()}>
                  TRANSFERIR
                </button>
              </div>
            </div>
          ) : null}

        </div>
      )}
    </div>
  );
};

export default AlphaCards;