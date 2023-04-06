import React, { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import HTMLFlipBook from "react-pageflip";
import { FcCheckmark } from 'react-icons/fc'
import pagination from "../../../artifacts/utils/placeholders";
import InventoryAlbum from "./InventoryAlbum";
import GammaAlbum from "./GammaAlbum";
import book from "../Hero/background/book.png"
import GammaPack from "./GammaPack";

import { ethers } from "ethers";
import gammaPacksAbi from "../../../artifacts/contracts/GammaPacks.sol/GammaPacks.json";
import gammaCardsAbi from "../../../artifacts/contracts/GammaCardsV2.sol/GammaCardsV2.json";
import daiAbi from "../../../artifacts/contracts/TestDAI.sol/UChildDAI.json";
import Web3Modal from "web3modal";
import InfoCard from "./InfoCard";

const index = React.forwardRef((props, book) => {
  const [packsEnable, setPacksEnable] = useState(false)

  // sets for metamask // 
  const production = false;
  const [account, setAccount] = useState(null);
  const [noMetamaskError, setNoMetamaskError] = useState("")
  const [chainId, setChainId] = useState(null);
  const validChainId = production ? "0x89" : "0x13881";
  const [packsContract, setPacksContract] = useState(null)
  const [cardsContract, setCardsContract] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [loading, setLoading] = useState(null)


  //// autorizations /////
  const authorizeDaiContract = async () => {
    const authorization = await daiContract.approve(
      packsContractAddress,
      ethers.constants.MaxUint256,
      { gasLimit: 2500000 }
    );
    setLoading(true);
    await authorization.wait();
    setLoading(false);
    return authorization;
  };

  const checkApproved = async (approvedAddress, tokenOwner) => {
    const approved = await daiContract.allowance(tokenOwner, approvedAddress);
    return approved.gt(0);
  };

  const checkBalance = async () => {
    // Get the account balance from the Dai contract
    const balance = await daiContract.balanceOf(account);
    // Convert the balance from a BigNumber to a number
    const number = JSON.parse(ethers.BigNumber.from(balance).toString());

    // Set the minimum balance value to 1 Dai
    const minimum = 1000000000000000000;

    // Return true if the account balance is greater than the minimum value, false otherwise
    return number > minimum;
  };
  const buypackk = () => {
    if (checkBalance(account)) {
      checkApproved(packsContractAddress, account)
        .then((res) => {
          const comprarPack = async () => {
            const packBought = await packsContract.buyPack({ gasLimit: 2500000 });
            setLoading(true);
            await packBought.wait();
            setLoading(false);
            console.log(` esto es el ${packBought}`)
            return packBought;
          };
          if (res) {
            comprarPack()
            console.log('entro el if res linea 78')
          } else {
            console.log('entro el else')
            authorizeDaiContract()
              .then(() => {
                comprarPack()
                  .catch((e) => {
                    console.log('entro el 1 catch')
                    console.error({ e });
                    setLoading(false);
                  });
              })
          }
        })
        .catch((e) => {
          console.log('entro el  tercer catch')
          console.error({ e });
          setLoading(false);
        });
    } else {
      Swal.fire({
        title: "oops!",
        text: "No tienes suficientes DAI!",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }

  }
  const buyPack = (price, name) => {
    showCards(account, seasonName)
      .then((cards) => {
        checkPacks()
          .then((res) => {
            if (!res || res.length == 0) {
              setNoCardsError("No hay más packs disponibles.");
              return;
            } else {
              if (checkBalance(account)) {
                checkApproved(contractAddress, account)
                  .then((res) => {
                    const comprarPack = async (price, name) => {
                      const pack = await nofContract.buyPack(price, name, {
                        gasLimit: 2500000,
                      });
                      setLoading(true);
                      await pack.wait();
                      setLoading(false);
                      return pack;
                    };
                    if (res) {
                      comprarPack(price, name)
                        .then((pack) => {
                          setPack(pack);
                          showCards(account, seasonName);
                        })
                        .catch((err) => {
                          console.error({ err });
                          setLoading(false);
                        });
                    } else {
                      authorizeDaiContract()
                        .then(() => {
                          comprarPack(price, name)
                            .then((pack) => {
                              setPack(pack);
                              showCards(account, seasonName);
                            })
                            .catch((e) => {
                              console.error({ e });
                              setLoading(false);
                            });
                        })
                        .catch((e) => {
                          console.error({ e });
                          setLoading(false);
                        });
                    }
                  })
                  .catch((e) => {
                    console.error({ e });
                    setLoading(false);
                  });
              } else {
                Swal.fire({
                  title: "oops!",
                  text: "No tienes suficientes DAI!",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            }
          })
          .catch((e) => {
            console.error({ e });
            setLoading(false);
          });
      })
      .catch((e) => {
        console.error({ e });
        setLoading(false);
      });
  };

  const api_endpoint = "https://cors-anywhere.herokuapp.com/https://gamma-microservice-7bteynlhua-uc.a.run.app/";
  const bodyJson = {
    "address": "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", // address del usuario
    "packet_number": 0 // numero de paquete que se esta abriendo
  }

  // funcion para llamar al contrato, hay que pasarle el numero de pack, las cartas y la signature, para lo cual primero hay que llamar a la api
  const openPacks = async (packNumber, packData, signature) => {
    console.log(packNumber)
    const open = await cardsContract?.openPack(packNumber, packData, signature, { gasLimit: 2500000 })
    await open.wait()
    console.log(open)
    return open
  }


  // llamada a la api para que nos de la data a pasar en la llamada al contrato
  const fetchPackData = async () => {
    try {
      const response = await fetch(api_endpoint, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(bodyJson),
      })
      const data = await response.json()
      console.log({ data })

      // de aca sacamos la data que necesitamos de la api: las cartas y la firma
      const { packet_data, signature } = data;
      // llamada al contrato
      openPacks(data.packet_number, packet_data, signature.signature)

    } catch (e) {
      console.error({ e })
    }
  }
  /////////////////
  const [mobile, setMobile] = useState(false);
  const [size, setSize] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobile(true);
      setSize(true);
    } else {
      setMobile(false);
      setSize(false);
    }
    const updateMedia = () => {
      if (window.innerWidth < 600) {
        setMobile(true);
        setSize(true);
      } else {
        setMobile(false);
        setSize(false);
      }
    };
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);
  const images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [inventory, setInventory] = useState(true)
  const [openPack, setOpenPack] = useState(false)

  ///// ////////////
  // const packsContractAddress = "0xA7bBa4378E69e4dF9E45f1cd39Cc39b7660BD42b"
  const packsContractAddress = "0xCe34F22aA619705130A5af266Ed1B48AcdB4ff81"
  // const cardsContractAddress = "0xAB3D0ba4dB15381f96EFCDbB15d93CE0835857FE"
  const cardsContractAddress = "0x0Ebe1E11E416968680276225e0DAB820C88d2aE9"
  const daiAddress = "0x496E0cDfF61e86294F8F4ca8D3822C8Bd01949d1"


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
      console.error({ e });
    }

    if (!provider) return;
    const chain = (await provider.getNetwork()).chainId;
    setChainId(decToHex(chain));

    const chainName = production ? "Polygon Mainnet" : "Mumbai";
    const rpcUrl = production ? "https://polygon-mainnet.infura.io" : "https://rpc-mumbai.maticvigil.com";
    const currency = "MATIC";
    const explorer = production ? "https://polygonscan.com/" : "https://mumbai.polygonscan.com/";
    switchOrCreateNetwork(validChainId, chainName, rpcUrl, currency, explorer);
    return [provider, address];
  }

  function connectToMetamask() {
    if (window.ethereum !== undefined) {
      setNoMetamaskError("");
      requestAccount().then((data) => {
        const [provider, address] = data;
        const signer = provider.getSigner();
        let gammaPacksContractInstance = new ethers.Contract(
          packsContractAddress,
          gammaPacksAbi.abi,
          signer
        );
        setPacksContract(gammaPacksContractInstance);
        let gammaCardsContractInstance = new ethers.Contract(
          cardsContractAddress,
          gammaCardsAbi.abi,
          signer
        );
        setCardsContract(gammaCardsContractInstance);
        let daiContractInstance = new ethers.Contract(
          daiAddress,
          daiAbi.abi,
          signer
        );
        setDaiContract(daiContractInstance)
      })
        .catch(e => {
          console.error({ e })
        });
    } else {
      setNoMetamaskError("Por favor instala Metamask para continuar.")
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
          console.error(e.message);
        }
      }
    }
  }

  useEffect(() => {
    if (window && window.ethereum !== undefined) {
      window.ethereum.on('accountsChanged', (accounts) => {
        connectToMetamask()
      })

      window.ethereum.on('chainChanged', newChain => {
        setChainId(decToHex(newChain))
        connectToMetamask()
      })
    }
  }, [])

  const checkPacks = async () => {
    try {
      const packs = await packsContract?.getPacksByUser(account);
      if (packs.length == 0) {
        setPacksEnable(false)
      }
      if (packs.length >= 1) {
        setPacksEnable(true)
      }
      return packs;
    } catch (e) {
      console.error({ e })
    }
  }
  const openAvailablePack = async () => {

    try {
      const openedPack = await packsContract.openPack(1, {
        gasLimit: 2500000,
      });

      console.log(openedPack)
      return openedPack

    } catch (e) {
      console.error({ e })
    }
  }
  useEffect(() => {
    checkPacks()
  }, [packsContract])
  const [cardInfo,setCardInfo] = useState(false)
  const [imageNumber,setImageNumber] = useState(0)


  // useEffect(() => {
  //   const loadingElem = document.getElementById("loading");
  //   loading
  //     ? loadingElem.setAttribute("class", "alpha_loader_container")
  //     : loadingElem.setAttribute(
  //       "class",
  //       "alpha_loader_container alpha_display_none"
  //     );
  // }, [loading]);

  return (
    <>
      {!account && <div className="alpha">
        <div className="alpha_loader_container alpha_display_none" id="loading">
          <span
            className="loader"
          ></span>
        </div>
        <div className="alpha_main_buttons_container">
          <button className="alpha_button alpha_main_button" id="connect_metamask_button" onClick={() => connectToMetamask()}>Conectar con Metamask</button>
          <button className="alpha_button alpha_main_button" id="show_rules_button" onClick={() => showRules()}>Reglas</button>
          <span>{noMetamaskError}</span>
        </div>
        {/* <div className="alpha_rules_container">
          <button className="alpha_rules_img_close alpha_modal_close" onClick={() => closeRules()}>X</button>
          <img className="alpha_rules_img" src={reglas.src} tabIndex="0" />
        </div> */}
      </div>}
      <Navbar  cardInfo={cardInfo} setCardInfo={setCardInfo}inventory={inventory} setInventory={setInventory} />
      {account && <div className="gamma_main">
        {openPack && <GammaPack setOpenPack={setOpenPack} />}
        <Head>
          <title>Number One Fan</title>
          <meta name="description" content="NoF Gamma" />
          <link rel="icon" href="./favicon.ico" />
        </Head>
        <div className="hero__top">
          {!mobile && <div onClick={() => setInventory(false)} className="gammaAlbums"></div>}
          <div style={inventory ? { backgroundImage: `url('assets/gamma/InventarioFondo.png')` } : { backgroundImage: `url('assets/gamma/GammaFondo.png')` }} className="hero__top__album">
            {inventory && !cardInfo && <InventoryAlbum
                                          account={account}
                                          cardsContract={cardsContract}
                                          setImageNumber={setImageNumber}
                                          setCardInfo={setCardInfo}
                                          cardInfo={cardInfo}
                                        />}
            {!inventory && <GammaAlbum />}
            {inventory && cardInfo &&  <InfoCard imageNumber={imageNumber} cardsContract={cardsContract} setLoading={setLoading}/>}
          </div>
          {/* {!mobile && packsEnable && <div onClick={() => { setOpenPack(true), fetchPackData() }} className="gammaFigures">Buy Pack</div>}
          {!mobile && !packsEnable && <div onClick={() => { setOpenPack(true), buypackk() }} className="gammaFigures"><h2>Buy Pack</h2></div>} */}
          {!mobile && <div className="gammaShop"></div>}
        </div>
      </div >}
      <Footer />
    </>
  );
});

export default index
