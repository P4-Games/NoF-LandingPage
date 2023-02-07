import React from "react";
import Head from "next/head";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import HTMLFlipBook from "react-pageflip";

const GammaInventory = React.forwardRef((props, book)) => (
  <div className="gamma_main">
    <Head>
      <title>Number One Fan</title>
      <meta name="description" content="NoF Gamma" />
      <link rel="icon" href="./favicon.ico" />
    </Head>
    <Navbar />
    <HTMLFlipBook
      id="Book"
      size={"stretch"}
      width={360}
      height={500}
      minWidth={350}
      maxWidth={800}
      minHeight={500}
      maxHeight={800}
      autoSize={true}
      ref={book}
      usePortrait={size}
      drawShadow={false}
      className="hero__top__album__book"
    >
      <div>Prueba</div>
    </HTMLFlipBook>
    <Footer />
  </div>
);

export default GammaInventory;
