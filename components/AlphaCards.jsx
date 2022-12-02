import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import nofAbi from "../artifacts/contracts/NOF-SC.sol/NOF_Alpha";
import daiAbi from "../artifacts/contracts/TestDAI.sol/Dai.json";

const storageUrl = "https://storage.googleapis.com/hunterspride/NOFJSON/T1/"; // 1.png to 60.png
const contractAddress = "0x8F0784f7A7919C8420B7a06a44891430deA0e079"; // test contract mumbai network
const daiAddress = "0xF995C0BB2f4F2138ba7d78F2cFA7D3E23ce05615"; // test dai contract with unlimited minting

const AlphaCards = () => {
  const [chainId, setChainId] = useState(null);
  const validChainId = "0x13881";
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(null)
  const [account, setAccount] = useState(null);
  const [nofContract, setNofContract] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [pack, setPack] = useState(null)
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
    console.log({ seasonData })
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

  const showCards = (address, seasonName) => {
    const cards = getUserCards(address, seasonName)
      .then(cards => {
        if(cards.length){
          setPack(cards)
          setErrorMessage("")
          document.getElementById("alpha_show_cards_button").style.display = "none"
          document.getElementById("alpha_buy_pack_button").style.display = "none"
          return cards
        } else {
          setErrorMessage("Necesitas comprar un Pack, primero.")
          setPack([])
        }
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
      console.log({cards})
      if(cards && cards.length > 0) return
    checkApproved(contractAddress, account)
    .then(res => {
      const comprarPack = async (price, name) => {
        const pack = await nofContract.buyPack(price, name)
        setLoading(true)
        await pack.wait()
        setLoading(false)
        return pack
      }
      console.log({ res })
      if(res){
        comprarPack(price, name)
          .then(pack => {
            setPack(pack)
            showCards(account, seasonName)
          })
          .catch(e => {
            console.log({ e })
            setErrorMessage(e.reason)
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
            setErrorMessage(e.reason)
            setLoading(false)
          })
        })
          .catch(e => {
            console.log({ e })
            setErrorMessage(e.reason)
          })
        }
      })
    .catch(e => {
      console.log({ e })
      setErrorMessage(e.reason)
    })
    })
    .catch(e => {
      console.log({ e })
      setErrorMessage(e.reason)
    })
  }

  const pasteCard = (card, album) => {
    const pegarCarta = async (card, album) => {
      const paste = await nofContract.pasteCards(card, album)
      setLoading(true)
      await paste.wait()
      setLoading(false)
    }
    pegarCarta(card, album)
      .then(() => {
        showCards(account, seasonName)
      })
      .catch(e => {
        setErrorMessage(e.message)
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
      setErrorMessage("La dirección de destino es inválida.");
      return false;
    }
    for (let i = 2; i < receiverAccount.length; i++) {
      if (!hexa.includes(receiverAccount[i])) {
        setErrorMessage("La dirección de destino es inválida.");
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
        setErrorMessage("");
        setLoading(true);
        await transaction.wait();
        showCards(account, seasonName);
        setReceiverAccount("")
        const modal = document.getElementsByClassName("alpha_transfer_modal")[0];
        modal.setAttribute("class", "alpha_transfer_modal alpha_display_none");
        setLoading(false);
      }
    } catch (e) {
      setErrorMessage(e.message)
    }
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
    if(typeof window.ethereum !== undefined){
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
        setErrorMessage(e.message)
        console.log({e})
      });
    })
    .catch(e => {
      setErrorMessage(e.message)
      console.log({e})
    });
  }, []);

  useEffect(() => {
    const loadingElem = document.getElementById("loading");
    loading
      ? loadingElem.setAttribute("class", "loader alpha_loading_elem")
      : loadingElem.setAttribute(
          "class",
          "loader alpha_loading_elem alpha_display_none"
        );
  }, [loading]);

  return (
    <div className="alpha">
      <span
        className="loader alpha_loading_elem alpha_display_none"
        id="loading"
      ></span>
      {account && (
        <div className="alpha_inner_container">
          <div className="alpha_data">
            <div className="alpha_account">Hola,{" "}
            {account &&
              account.substring(0, 6) +
                "..." +
                account.substring(37, account.length - 1)}
            !</div>
            <div className="alpha_season">Temporada: {seasonName}</div>
          </div>
          <div>
            <button onClick={() => showCards(account, seasonName)} className="alpha_button" id="alpha_show_cards_button">Muestra mis cartas</button>
            <button onClick={() => buyPack(packPrice, seasonName)} className="alpha_button" id="alpha_buy_pack_button">Comprar un Pack</button>
          </div>
          <div style={{"color":"red"}}>{errorMessage}</div>
          {pack && pack.length > 0 ? (
            <div className="alpha_container">
              {pack.map((card, i) => {
                const collection = ethers.BigNumber.from(
                  card.collection
                ).toNumber();
                const completion = ethers.BigNumber.from(
                  card.completion
                ).toNumber();
                return card.number % 6 == 0 ? (
                  <div>
                    <div key={i} className="alpha_album_container">
                      <img
                        src={storageUrl + card.number + ".png"}
                        className="alpha_album"
                      />
                    </div>
                    <span>Progreso: {completion}/5</span>
                    <br></br>
                    col: {collection}
                  </div>
                ) : null;
              })}
              <div className="alpha_cards_container">
                {pack.map((card, i) => {
                  const collection = ethers.BigNumber.from(
                    card.collection
                  ).toNumber();
                  const isCollection =
                    collection ==
                    ethers.BigNumber.from(pack[0].collection).toNumber();
                  const tokenId = ethers.BigNumber.from(
                    card.tokenId
                  ).toNumber();
                  const album = ethers.BigNumber.from(
                    pack[0].tokenId
                  ).toNumber();
                  return card.number % 6 !== 0 ? (
                    <div key={i}>
                      <div className="alpha_card_container">
                        <div className="alpha_card_hover">
                          <button
                            className="alpha_button"
                            onClick={() =>
                              pasteCard(tokenId, album)
                            }
                            disabled={!isCollection}
                          >
                            PEGAR
                          </button>
                          <button
                            className="alpha_button"
                            onClick={() => {
                              setCardToTransfer(tokenId);
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
                        <img
                          src={storageUrl + card.number + ".png"}
                          className="alpha_card"
                        />
                      </div>
                      col: {collection}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ) : null}
        </div>
      )}
      <div className="alpha_transfer_modal alpha_display_none">
        <input
          placeholder="Address"
          value={receiverAccount}
          onChange={(e) => setReceiverAccount(e.target.value)}
        />
        <button className="alpha_button" onClick={() => transferToken()}>
          TRANSFERIR
        </button>
      </div>
    </div>
  );
};

export default AlphaCards;
