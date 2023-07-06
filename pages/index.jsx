import React, { useRef } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Hero from "./sections/Hero";
import Footer from "../components/Footer";
import useTranslation from "../components/Navbar/useTranslation";

function Home() {
  const book = useRef(null);
  function turnNextPage() {
    book.current.pageFlip().flipNext();
  }
  function turnPrevPage() {
    book.current.pageFlip().flipPrev();
  }
  function onFlip() {
    page.onFlip();
  }
  function goToCollections(number) {
    book.current.pageFlip().flip(number);
  }
  const { language, setLanguage, setFallbackLanguage, t } = useTranslation();

  return (
    <div className="home">
      <Head>
        <title>Number One Fan</title>
        <meta name="description" content="Number One Fan" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <Navbar
        onFlip={onFlip}
        goToCollections={goToCollections}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
      <Hero
        ref={book}
        language={language}
        setLanguage={setLanguage}
        t={t}
        turnNextPage={turnNextPage}
        turnPrevPage={turnPrevPage}
      />
      <Footer turnNextPage={turnNextPage} turnPrevPage={turnPrevPage} />
    </div>
  );
}

export default Home;
