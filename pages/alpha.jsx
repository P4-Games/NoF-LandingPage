import Head from "next/head";
import Navbar from "../components/Navbar";
// import Link from 'next/link'
import Footer from "../components/Footer";
// import EthersProvider from '../context/EthersContext'
import AlphaCards from "../components/AlphaCards";
import { useState } from "react";

const Alpha = () => {
  const [loadAlbums, setLoadAlbums] = useState(false);
  function alphaMidButton() {
    const albums = document.getElementsByClassName(
      "alpha_full_albums_container"
    )[0];
    const game = document.getElementsByClassName("alpha_inner_container")[0];
    if (game) {
      albums.classList.toggle("alpha_display_none");
      game.classList.toggle("alpha_display_none");
    }
  }

  return (
    <div className="alpha_main">
      <Head>
        <title>Number One Fan</title>
        <meta name="description" content="NoF Alpha" />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <Navbar
        alphaMidButton={alphaMidButton}
        loadAlbums={loadAlbums}
        setLoadAlbums={setLoadAlbums}
      />
      <AlphaCards loadAlbums={loadAlbums} />
      <Footer />
    </div>
  );
};

export default Alpha;
