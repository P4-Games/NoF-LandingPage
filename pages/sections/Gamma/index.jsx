import React, { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import HTMLFlipBook from "react-pageflip";
import { FcCheckmark } from 'react-icons/fc'
import pagination from "../../../artifacts/utils/placeholders";
import InventoryAlbum from "./InventoryAlbum";
import GammaAlbum from "./GammaAlbum";
import albums from "../../../public/assets/gamma/albums.png"
import GammaPack from "./GammaPack";
import { TfiEnvelope } from 'react-icons/tfi';
import { ethers } from "ethers";
import gammaPacksAbi from "../../../artifacts/contracts/GammaPacks.sol/GammaPacks.json";
import gammaCardsAbi from "../../../artifacts/contracts/GammaCardsV2.sol/GammaCardsV2.json";
import daiAbi from "../../../artifacts/contracts/TestDAI.sol/UChildDAI.json";
import Web3Modal from "web3modal";
import InfoCard from "./InfoCard";
import { fetchPackData } from "../../../services/backend/gamma";
import { checkPacksByUser, openPack } from "../../../services/contracts/gamma";

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
  const [openPackCardsNumbers, setOpenPackCardsNumbers] = useState([])
  const [numberOfPacks, setNumberOfPacks] = useState("0")
  const [openPackage, setOpenPackage] = useState(false)


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

  const checkNumberOfPacks = async () => {
    try {
      const numberOfPacks = await checkPacksByUser(account, packsContract)
      setNumberOfPacks(numberOfPacks?.length.toString())
      console.log({ numberOfPacks })
    } catch (e) {
      console.error({ e })
    }
  }

  useEffect(() => {
    checkNumberOfPacks()
  }, [account, packsContract])

  const [inventory, setInventory] = useState(true)
  const [packIsOpen, setPackIsOpen] = useState(false)

  ///// ////////////
  // const packsContractAddress = "0xA7bBa4378E69e4dF9E45f1cd39Cc39b7660BD42b"
  const packsContractAddress = "0xDe30a1B73031ccB456967BE9f103DaF23A006d1b"
  // const cardsContractAddress = "0xAB3D0ba4dB15381f96EFCDbB15d93CE0835857FE"
  const cardsContractAddress = "0xEefF8D035A60AC3E1456991C2A2C2dEb31C84B76"
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
  const [loaderPack, setLoaderPack] = useState(false)

  // funcion para abrir uno a uno los sobres disponibles
  const openAvailablePack = async () => {
    try {
      // llama al contrato para ver cantidad de sobres que tiene el usuario
      const packs = await checkPacksByUser(account, packsContract) // llamada al contrato
      setLoaderPack(true)
      console.log('entro dspues del loader')
      if (packs.length == 0) {
        setPacksEnable(false)
        alert("No tienes paquetes para abrir!")
      }
      if (packs.length >= 1) {
        const packNumber = ethers.BigNumber.from(packs[0]).toNumber()
        // llama a la api para recibir los numeros de cartas del sobre y la firma
        const data = await fetchPackData(account, packNumber) // llamada al back
        const { packet_data, signature } = data;

        setOpenPackCardsNumbers(packet_data)
        setPacksEnable(true)
        // llama al contrato de cartas para abrir el sobre
        const openedPack = await openPack(cardsContract, packNumber, packet_data, signature.signature)
        if (openedPack) {
          await openedPack.wait()
          setOpenPackage(true)
          setLoaderPack(false)
          await checkNumberOfPacks()
          return openedPack
        } else {
          setLoaderPack(false)
          return
        }
      }
    } catch (e) {
      console.error({ e })
    }
  }

  const [cardInfo, setCardInfo] = useState(false)
  const [imageNumber, setImageNumber] = useState(0)

  useEffect(() => {
    const loadingElem = document.getElementById("loading");
    loading
      ? loadingElem?.setAttribute("class", "alpha_loader_container")
      : loadingElem?.setAttribute(
        "class",
        "alpha_loader_container alpha_display_none"
      );
  }, [loading]);

  return (
    <>
      {!account && <div className="alpha">
        <div className="alpha_loader_container alpha_display_none" id="loading">
          <span className="loader"></span>
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

      <Navbar
        account={account}
        cardInfo={cardInfo}
        setCardInfo={setCardInfo}
        inventory={inventory}
        setInventory={setInventory}
        packsContract={packsContract}
        checkApproved={checkApproved}
        authorizeDaiContract={authorizeDaiContract}
        checkNumberOfPacks={checkNumberOfPacks}
      />

      {account && <div className="gamma_main">
        {packIsOpen && <GammaPack
          loaderPack={loaderPack}
          setPackIsOpen={setPackIsOpen}
          cardsNumbers={openPackCardsNumbers}
          setOpenPackage={setOpenPackage}
          openPackage={openPackage}
        />}
        <Head>
          <title>Number One Fan</title>
          <meta name="description" content="NoF Gamma" />
          <link rel="icon" href="./favicon.ico" />
        </Head>
        <div className="hero__top">
          {!mobile && inventory && <img src="assets/gamma/albums.png" onClick={() => setInventory(false)} className="gammaAlbums"></img>}
          {!mobile && !inventory && <div onClick={() => setInventory(false)} className="gammaAlbums2"></div>}
          <div style={inventory ? { backgroundImage: `url('assets/gamma/InventarioFondo.png')` } : { backgroundImage: `url('assets/gamma/GammaFondo.png')` }} className="hero__top__album">
            {inventory && !cardInfo && <InventoryAlbum
              account={account}
              cardsContract={cardsContract}
              setImageNumber={setImageNumber}
              setCardInfo={setCardInfo}
              cardInfo={cardInfo}
            />}
            {!inventory && <GammaAlbum />}
            {inventory && cardInfo && <InfoCard imageNumber={imageNumber} cardsContract={cardsContract} setLoading={setLoading} />}
          </div>
          {/* {!mobile && packsEnable && <div onClick={() => { setPackIsOpen(true), fetchPackData() }} className="gammaFigures">Buy Pack</div>}
          {!mobile && !packsEnable && <div onClick={() => { setPackIsOpen(true), buypack() }} className="gammaFigures"><h2>Buy Pack</h2></div>} */}
          {!mobile && inventory &&
            <div onClick={() => { setPackIsOpen(true), openAvailablePack() }} className="gammaShop">
              <h1>{numberOfPacks ? numberOfPacks : ""}</h1>
              <div className="album">
                {/* <h2>{numberOfPacks}</h2> */}
                <h3>TRANSFER</h3>
              </div>
            </div>}

          {!mobile && !inventory &&
            <div className="gammaComplete">
              <h3>Album</h3>
              <h3>24/120</h3>
              <h3>Completar</h3>
            </div>}
        </div>
      </div >}
      <Footer />
    </>
  );
});

export default index



