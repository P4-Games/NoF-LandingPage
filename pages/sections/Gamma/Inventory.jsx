import React, { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import HTMLFlipBook from "react-pageflip";
import { FcCheckmark } from 'react-icons/fc'
import pagination from "./placeholders";


const GammaInventory = React.forwardRef((props, book) => {
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

  return (
    <div className="gamma_main">
      <Head>
        <title>Number One Fan</title>
        <meta name="description" content="NoF Gamma" />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <Navbar />
      <div className="hero__top">
        {!mobile && <div className="gammaAlbums"></div>}
        <div className="hero__top__album">
          <HTMLFlipBook
            id="Book"
            size={"stretch"}
            width={360}
            height={500}
            minWidth={300}
            maxWidth={800}
            minHeight={350}
            maxHeight={800}
            autoSize={true}
            drawShadow={false}
            usePortrait={size}
            ref={book}
            className="hero__top__album__book"
          >
            <div
              className="hero__top__album__book__page"
              data-density="hard"
              number="1"
            >
              <div className="hero__top__album__book__page__page-content">
                <div className="grid-wrapper">
                  {pagination.page1.map((item, index) => {
                    return (
                      <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                        <img onClick={console.log(item)} src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                        {pagination.fakeUser[item].stamped && <FcCheckmark />}
                        <div className='number'>{pagination.fakeUser[item].name}</div>
                        {pagination.fakeUser[item].quantity != 0 && pagination.fakeUser[item].quantity != 1
                          &&
                          <div className='quantity'>X:{pagination.fakeUser[item].quantity}</div>
                        }
                      </div>
                    )
                  })}
                  {/* {Object.entries(pagination).map((item))} */}
                </div>
              </div>
            </div>
            <div
              className="hero__top__album__book__page0"
              data-density="hard"
              number="2"
            >
              <div className="grid-wrapperright">
                {pagination.page2.map((item, index) => {
                  return (
                    <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                      <img onClick={console.log(item)} src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                      {pagination.fakeUser[item].stamped && <FcCheckmark />}
                      <div className='number'>{pagination.fakeUser[item].name}</div>
                      {pagination.fakeUser[item].quantity != 0 && pagination.fakeUser[item].quantity != 1
                        &&
                        <div className='quantity'>X:{pagination.fakeUser[item].quantity}</div>
                      }
                    </div>
                  )
                })}
              </div>
            </div>
            <div
              className="hero__top__album__book__page"
              data-density="hard"
              number="3"
            >
              <div className="hero__top__album__book__page__page-content">
                Prueba3
              </div>
            </div>
          </HTMLFlipBook>
        </div>
        {!mobile && <div className="gammaFigures"></div>}
      </div>
      <Footer />
    </div>
  );
});

export default GammaInventory;
