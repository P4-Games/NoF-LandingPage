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
import gammaCardsAbi from "../../../artifacts/contracts/GammaCards.sol/GammaCards.json";
import daiAbi from "../../../artifacts/contracts/TestDAI.sol/UChildDAI.json";
import Web3Modal from "web3modal";


const index = React.forwardRef((props, book) => {

  // sets for metamask // 
  const production = true;
  const [account, setAccount] = useState(null);
  const [noMetamaskError, setNoMetamaskError] = useState("")
  const [chainId, setChainId] = useState(null);
  const validChainId = production ? "0x89" : "0x13881";
  const [packsContract, setPacksContract] = useState(null)
  const [cardsContract, setCardsContract] = useState(null)
  const [daiContract, setDaiContract] = useState(null)
  const [loading, setLoading] = useState(null)

  // /////// sets for metamask 
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
  const packsContractAddress = '0x8C7BBBE25B95BAde8aCd06a5cd21D093446Cf7eF'
  const cardsContractAddress = " 0x3957311EA2229bd557E7173BB12c9633BFeC5B12"
  const daiAddress = " 0x496E0cDfF61e86294F8F4ca8D3822C8Bd01949d1"


  async function requestAccount() {
    const web3Modal = new Web3Modal();
    let provider;
    let address;
    try {
      const connection = await web3Modal.connect();
      provider = new ethers.providers.Web3Provider(connection);
      address = await provider.getSigner().getAddress();
      setAccount(address);
      console.log(account)
      // document.getElementsByClassName('alpha_main_buttons_container')[0].style.display = "none"
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
        // console.log(data)
        const [provider, address] = data;
        const signer = provider.getSigner();
        let gammaPacksContractInstance = new ethers.Contract(
          packsContractAddress,
          gammaPacksAbi.abi,
          signer
        )
        setPacksContract(gammaPacksContractInstance);
        let gammaCardsContractInstance = new ethers.Contract(
          cardsContractAddress,
          gammaCardsAbi.abi,
          signer
        )
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
      <Navbar inventory={inventory} setInventory={setInventory} />
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
            {inventory && <InventoryAlbum />}
            {!inventory && <GammaAlbum />}
          </div>
          {!mobile && <div onClick={() => setOpenPack(true)} className="gammaFigures"></div>}
        </div>
      </div >}
      <Footer />
    </>
  );
});

export default index
