import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-scroll";
import Image from "next/image";
import audio from "./music/Dungeon.mp3";
import Whitepaper from "./Whitepaper.jsx";
import NofTown from "./NofTown.jsx";
import Coin from "./icons/logo-coin.png";
import Nof from "./icons/logo-1.png";
import SoundOn from "./icons/sound.png";
import SoundOff from "./icons/soundoff.png";
import Shopimg from "./icons/shop.png";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

// import TranslationComponent from './translationComponent.jsx'

const TranslationComponent = dynamic(
  () => import("./translationComponent.jsx"),
  { ssr: false }
);

function Navbar({
  onFlip,
  goToCollections,
  language,
  setLanguage,
  alphaMidButton,
  t,
  account,
  setLoadAlbums,
  loadAlbums,
  setInventory,
  inventory,
  setCardInfo,
  cardInfo,
  packsContract,
  checkApproved,
  authorizeDaiContract
}) {
  const [midButton, setMidButton] = useState("");
  const [page, setPage] = useState("");
  const [wantedSobres, setWantedSobres] = useState(null)
  const router = useRouter();
  const ref = useRef(null);
  const [click, setClick] = useState(false);
  const handleClick = () => {
    setClick(!click);
    if (!click) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  };

  useEffect(() => {
    setPage(window.history.state.url);
    window.history.state.url == "/alpha" ? setMidButton("Albums") : null;
    window.history.state.url == "/gamma" ? setMidButton("Inventory") : null;
  }, []);

  const callContract = async (numberOfPacks) => {
    packsContract.on("PacksPurchase", (returnValue, theEvent) => {
      console.log(returnValue, theEvent);
    })
    
    try {
      const approval =  await checkApproved(packsContract.address, account)
      if(!approval){
        
        await authorizeDaiContract()
        
        const call = await packsContract.buyPacks(numberOfPacks);
        await call.wait()
        return call;

      } else {
        const call = await packsContract.buyPacks(numberOfPacks);
        await call.wait()
        return call;
      }

    } catch (e) {
      console.error({ e })
    }
  }

  const buySobres = () => {
    Swal.fire({
      text: "Elige la cantidad de sobres que quieres comprar",
      html: '<h3> Elige la cantidad de sobres que quieres comprar</h3><input type="number" id="quiero" class="swal2-input" placeholder="Sobres">',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Comprar",
      confirmButtonColor: "#005EA3",
      color: "black",
      background: "white",
      customClass: {
        image: "cardalertimg",
        input: "alertinput"
      },
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const input = Swal.getPopup().querySelector("#quiero");
        setWantedSobres(input.value)
        alert("Confirmado");
        callContract(input.value);
      }
    })

  }

  return (
    <>
      <div className="navbar">
        <div className="navbar__icon">
          <div className="hover" id="coin">
            <a href="/">
              <Image src={Coin} id="coin" layout="fill" />
            </a>
          </div>
          <div className="hover" id="nof">
            <a href="/">
              <Image src={Nof} alt="" layout="fill" />
            </a>
          </div>
        </div>
        <ul className="navbar__ul">
          <li className="navbar__ul__li">
            <NofTown />
            <Link
              to="Contacto"
            // spy='true'
            >
              <button
                onClick={() => {
                  if (page == "/alpha") {
                    alphaMidButton();
                    setLoadAlbums && setLoadAlbums(!loadAlbums);
                  }
                  else if (page == "/gamma") {
                    if (cardInfo) {
                      setCardInfo(false)
                      setInventory(true)
                    }
                    else setInventory(true)
                    // setLoadAlbums && setLoadAlbums(!loadAlbums);
                  }
                  else {
                    goToCollections(5);
                    setLoadAlbums && setLoadAlbums(!loadAlbums);
                  }
                }}
                className="navbar__ul__li__contacto"
                onFlip={onFlip}
              >

                {t ? t("collections") : midButton}
              </button>
            </Link>
            <Whitepaper />
          </li>
        </ul>
        <div className="navbar__corner">
          {(router?.pathname == '/gamma')
            &&
            <div onClick={buySobres} className="navbar__corner__audio">
              <Image src={Shopimg} alt="shop" />
            </div>}
          <div onClick={() => handleClick()} className="navbar__corner__audio">
            {/* <Image src={SoundOn} alt="" /> */}
            {click ? (
              <Image src={SoundOn} alt="soundimg" />
            ) : (
              <Image src={SoundOff} alt="soundimg" />
            )}
            <></>
          </div>
          <TranslationComponent
            language={language}
            setLanguage={setLanguage}
            t={t}
          />
        </div>
      </div>

      <audio src={audio} ref={ref} loop />
    </>
  );
}

export default Navbar;
