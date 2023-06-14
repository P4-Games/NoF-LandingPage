import React, { useState, useEffect } from "react";
import Footer from "../../../components/Footer";
import HTMLFlipBook from "react-pageflip";
import { FcCheckmark } from 'react-icons/fc'
import pagination from "../../../artifacts/utils/placeholders";

const InventoryAlbum = React.forwardRef((props, book) => {

    const { account, cardsContract } = props;
    const [mobile, setMobile] = useState(false);
    const [size, setSize] = useState(false);
    const [paginationObj, setPaginationObj] = useState({})

    useEffect(() => {
        windowSize()
    }, []);

    useEffect(() => {
        getUserCards()
    }, [account, cardsContract])

    const windowSize = () => {
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
    }

    const getUserCards = async () => {
        try {
            const cardsArr = await cardsContract.getCardsByUser(account)
            const cardsObj = pagination;
            for (let i = 0; i < cardsArr[0].length; i++) {
                cardsObj.fakeUser[cardsArr[0][i]].stamped = true;
                cardsObj.fakeUser[cardsArr[0][i]].quantity = cardsArr[1][i];
            }
            setPaginationObj(cardsObj)
        } catch (e) {
            console.error({ e })
        }
    }

    return paginationObj.page1 ?

        (
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
                            {paginationObj && paginationObj.page1.map((item, index) => {
                                return (
                                    <div onClick={() => { props.setCardInfo(true), props.setImageNumber(item) }}
                                        style={paginationObj.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                        <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                        {paginationObj.fakeUser[item].stamped && <FcCheckmark />}
                                        <div className='number'>{paginationObj.fakeUser[item].name}</div>
                                        {paginationObj.fakeUser[item].quantity != 0 && paginationObj.fakeUser[item].quantity != 1
                                            &&
                                            <div className='quantity'>X:{paginationObj.fakeUser[item].quantity}</div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div
                    className="hero__top__album__book__page0"
                    data-density="hard"
                    number="2"
                >
                    <div className="grid-wrapperright">
                        {paginationObj && paginationObj.page2.map((item, index) => {
                            return (
                                <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                    <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                    {paginationObj.fakeUser[item].stamped && <FcCheckmark />}
                                    <div className='number'>{paginationObj.fakeUser[item].name}</div>
                                    {paginationObj.fakeUser[item].quantity != 0 && paginationObj.fakeUser[item].quantity != 1
                                        &&
                                        <div className='quantity'>X:{paginationObj.fakeUser[item].quantity}</div>
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
                    <div className="grid-wrapper">
                        {paginationObj && paginationObj.page3.map((item, index) => {
                            return (
                                <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                    <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                    {paginationObj.fakeUser[item].stamped && <FcCheckmark />}
                                    <div className='number'>{paginationObj.fakeUser[item].name}</div>
                                    {paginationObj.fakeUser[item].quantity != 0 && paginationObj.fakeUser[item].quantity != 1
                                        &&
                                        <div className='quantity'>X:{paginationObj.fakeUser[item].quantity}</div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div
                    className="hero__top__album__book__page0"
                    data-density="hard"
                    number="4"
                >
                    <div className="grid-wrapperright">
                        {paginationObj && paginationObj.page4.map((item, index) => {
                            return (
                                <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                    <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                    {paginationObj.fakeUser[item].stamped && <FcCheckmark />}
                                    <div className='number'>{paginationObj.fakeUser[item].name}</div>
                                    {paginationObj.fakeUser[item].quantity != 0 && paginationObj.fakeUser[item].quantity != 1
                                        &&
                                        <div className='quantity'>X:{paginationObj.fakeUser[item].quantity}</div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div
                    className="hero__top__album__book__page"
                    data-density="hard"
                    number="5"
                >
                    <div className="grid-wrapper">
                        {paginationObj && paginationObj.page5.map((item, index) => {
                            return (
                                <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                    <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                    {paginationObj.fakeUser[item].stamped && <FcCheckmark />}
                                    <div className='number'>{paginationObj.fakeUser[item].name}</div>
                                    {paginationObj.fakeUser[item].quantity != 0 && paginationObj.fakeUser[item].quantity != 1
                                        &&
                                        <div className='quantity'>X:{paginationObj.fakeUser[item].quantity}</div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div
                    className="hero__top__album__book__page0"
                    data-density="hard"
                    number="6"
                >
                    <div className="grid-wrapperright">
                        {paginationObj && paginationObj.page6.map((item, index) => {
                            return (
                                <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                    <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                    {paginationObj.fakeUser[item].stamped && <FcCheckmark />}
                                    <div className='number'>{paginationObj.fakeUser[item].name}</div>
                                    {paginationObj.fakeUser[item].quantity != 0 && paginationObj.fakeUser[item].quantity != 1
                                        &&
                                        <div className='quantity'>X:{paginationObj.fakeUser[item].quantity}</div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div
                    className="hero__top__album__book__page"
                    data-density="hard"
                    number="7"
                >
                    <div className="grid-wrapper">
                        {paginationObj && paginationObj.page7.map((item, index) => {
                            return (
                                <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                    <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                    {paginationObj.fakeUser[item].stamped && <FcCheckmark />}
                                    <div className='number'>{paginationObj.fakeUser[item].name}</div>
                                    {paginationObj.fakeUser[item].quantity != 0 && paginationObj.fakeUser[item].quantity != 1
                                        &&
                                        <div className='quantity'>X:{paginationObj.fakeUser[item].quantity}</div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div
                    className="hero__top__album__book__page0"
                    data-density="hard"
                    number="8"
                >
                    <div className="grid-wrapperright">
                        {paginationObj && paginationObj.page8.map((item, index) => {
                            return (
                                <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                    <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                    {paginationObj.fakeUser[item].stamped && <FcCheckmark />}
                                    <div className='number'>{paginationObj.fakeUser[item].name}</div>
                                    {paginationObj.fakeUser[item].quantity != 0 && paginationObj.fakeUser[item].quantity != 1
                                        &&
                                        <div className='quantity'>X:{paginationObj.fakeUser[item].quantity}</div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div
                    className="hero__top__album__book__page"
                    data-density="hard"
                    number="9"
                >
                    <div className="grid-wrapper">
                        {paginationObj && paginationObj.page9.map((item, index) => {
                            return (
                                <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                    <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                    {paginationObj.fakeUser[item].stamped && <FcCheckmark />}
                                    <div className='number'>{paginationObj.fakeUser[item].name}</div>
                                    {paginationObj.fakeUser[item].quantity != 0 && paginationObj.fakeUser[item].quantity != 1
                                        &&
                                        <div className='quantity'>X:{paginationObj.fakeUser[item].quantity}</div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div
                    className="hero__top__album__book__page0"
                    data-density="hard"
                    number="10"
                >
                    <div className="grid-wrapperright">
                        {paginationObj && paginationObj.page10.map((item, index) => {
                            return (
                                <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                    <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                    {paginationObj.fakeUser[item].stamped && <FcCheckmark />}
                                    <div className='number'>{paginationObj.fakeUser[item].name}</div>
                                    {paginationObj.fakeUser[item].quantity != 0 && paginationObj.fakeUser[item].quantity != 1
                                        &&
                                        <div className='quantity'>X:{paginationObj.fakeUser[item].quantity}</div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
                {/* <div
                className="hero__top__album__book__page"
                data-density="hard"
                number="3"
            >
                <div className="hero__top__album__book__page__page-content">
                    Prueba3
                </div>
            </div> */}
            </HTMLFlipBook>
        ) : null;
});

export default InventoryAlbum
