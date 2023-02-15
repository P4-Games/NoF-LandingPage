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


const index = React.forwardRef((props, book) => {
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

  return (
    <div className="gamma_main">
      {openPack && <GammaPack setOpenPack={setOpenPack} />}
      <Head>
        <title>Number One Fan</title>
        <meta name="description" content="NoF Gamma" />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <Navbar inventory={inventory} setInventory={setInventory} />
      <div className="hero__top">
        {!mobile && <div onClick={() => setInventory(false)} className="gammaAlbums"></div>}
        <div style={inventory ? { backgroundImage: `url('assets/gamma/InventarioFondo.png')` } : { backgroundImage: `url('assets/gamma/GammaFondo.png')` }} className="hero__top__album">
          {inventory && <InventoryAlbum />}
          {!inventory && <GammaAlbum />}
        </div>
        {!mobile && <div onClick={() => setOpenPack(true)} className="gammaFigures"></div>}
      </div>
      <Footer />
    </div >
  );
});

export default index
