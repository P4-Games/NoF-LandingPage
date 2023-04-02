import React, { useState, useEffect } from "react";
import Footer from "../../../components/Footer";
import HTMLFlipBook from "react-pageflip";
import { FcCheckmark } from 'react-icons/fc'
import pagination from "../../../artifacts/utils/placeholders";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Parallax,
  EffectCards,
} from "swiper";
import Swal from "sweetalert2";

const InfoCard = React.forwardRef((props, book) => {

    console.log({props})

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

    const mint = async () => {
        const { imageNumber, cardsContract, setLoading } = props;
        try {
            const transaction = await cardsContract.mintCard(imageNumber);
            setLoading(true)
            transaction.wait()
            setLoading(false)
            Swal.fire({
                title: "",
                text: `Carta Minteada! Puedes verla ${(<a href="https://testnets.opensea.io/assets/mumbai/${cardsContract.address}/${imageNumber}">aquí</a>)}`,
                icon: "success",
                showConfirmButton: true,
                // timer: 1500,
              })
            return transaction
        } catch (e) {
            console.error({ e })
        }
    }

    return (
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
                    <div className='cardinfo'>
                        <div className='cardinfoimg'>
                            <img src={`https://storage.googleapis.com/nof-gamma/T1/${props.imageNumber}.png`} alt="img" />
                        </div>
                        <h3>#{props.imageNumber}</h3>
                        <div className='cardnof'>
                           
                        </div>
                        
                    </div>
                </div>
            </div>
            <div
                className="hero__top__album__book__page0"
                data-density="hard"
                number="2"
            >
                <div className="cardinfo">
                    <div className="transactions">
                        <div
                          className="option"
                          onClick={() => mint()}
                        >Mintear

                        </div>
                        <div className="option2">
                            Ofertas

                        </div>
                        <div  onClick={() =>
                        Swal.fire({
                            text: 'Quieres poner un precio o elegir cartas?',
                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonText: 'Precio',
                            denyButtonText: `Cartas`,
                            color:"black",
                            background:"white",
                            customClass: {
                                image: 'cardalertimg',
                                input: 'alertinput',
                                // container: 'cardcontainer',
                                confirmButton: 'alertbuttonvender',
                                cancelButton: 'alertcancelbutton',
                            },
                          }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                Swal.fire({
                                    title: 'Precio',
                                    input: 'text',
                                    inputAttributes: {
                                      autocapitalize: 'off'
                                    },
                                    showCancelButton: true,
                                    confirmButtonText: 'Agregar precio',
                                    showLoaderOnConfirm: true,
                                    preConfirm: (login) => {
                                      return fetch(`//api.github.com/users/${login}`)
                                        .then(response => {
                                          if (!response.ok) {
                                            throw new Error(response.statusText)
                                          }
                                          return response.json()
                                        })
                                        .catch(error => {
                                          Swal.showValidationMessage(
                                            `Request failed: ${error}`
                                          )
                                        })
                                    },
                                    allowOutsideClick: () => !Swal.isLoading()
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      Swal.fire({
                                        text: `El precio elegido es ${result.value.login}`,
                                        imageUrl:`https://storage.googleapis.com/nof-gamma/T1/${props.imageNumber}.png`,
                                        color:`whitesmoke`,
                                        backdrop:"#0000009e",
                                        customClass: {
                                            image: 'cardalertimg',
                                            input: 'alertinput',
                                            // container: 'cardcontainer',
                                            popup: 'cardcontainer',
                                            confirmButton: 'alertbuttonvender',
                                            cancelButton: 'alertcancelbutton',
                                        },
                                      })
                                    }
                                  })
                            } else if (result.isDenied) {
                              Swal.fire('Changes are not saved', '', 'info')
                            }
                          })}
                          className="option3">
                            Publicar
                        </div>
                    </div>

                </div>
                {/* {pagination.page2.map((item, index) => {
                        return (
                            <div style={pagination.fakeUser[item].quantity == 0 ? { filter: 'grayscale(1)' } : {}} key={index} className="grid-item">
                                <img src={`https://storage.googleapis.com/nof-gamma/T1/${item}.png`} alt="img" />
                                {pagination.fakeUser[item].stamped && <FcCheckmark />}
                                <div className='number'>{pagination.fakeUser[item].name}</div>
                                {pagination.fakeUser[item].quantity != 0 && pagination.fakeUser[item].quantity != 1
                                    &&
                                    <div className='quantity'>X:{pagination.fakeUser[item].quantity}</div>
                                }
                            </div>
                        )
                    })} */}
            </div>
        </HTMLFlipBook>
    );
});

export default InfoCard
