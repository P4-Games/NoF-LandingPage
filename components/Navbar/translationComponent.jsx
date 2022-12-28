import useTranslation from "./useTranslation"
import World from './icons/world.png'
import Brazilean from './icons/br.png'
import English from './icons/en.png'
import Spanish from './icons/es.png'
import Image from "next/image.js"
import { useEffect } from "react"

function TranslationComponent() {


    // if (typeof window !== "undefined") {
    //     document.addEventListener("click", e => {
    //         const isDropdownButton = e.target.matches("[data-dropdown-button]")
    //         if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return

    //         let currentDropdown
    //         if (isDropdownButton) {
    //             currentDropdown = e.target.closest("[data-dropdown]")
    //             currentDropdown.classList.toggle("active")
    //         }
    //         document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
    //             if (dropdown === currentDropdown) return
    //             dropdown.classList.remove("active")
    //         })
    //     })
    // }

    const { language, setLanguage, setFallbackLanguage, t } = useTranslation()

    return (
        <>
            <div>{t("collections")}</div>
            <div className='dropdown' data-dropdown>
                <button className='link' data-dropdown-button>
                    <Image src={World} alt="language button" layout='fill' />
                </button>
                <div className='dropdown-menu'>
                    <ul className='language_ul'>
                        <li className='language_li'>
                            <button
                                className='lang-btn'
                            >
                                <Image
                                    onClick={() => setLanguage("es")}
                                    src={English}
                                    alt="English button"
                                    height={30} width={50} />
                            </button>
                        </li>
                        <li className='language_li'>
                            <button
                                className='lang-btn'
                                onClick={() => setLanguage("br")}
                            >
                                <Image
                                    onClick={() => setLanguage("br")}
                                    src={Brazilean}
                                    alt="Brazilean button"
                                    height={30} width={50} />
                            </button>
                        </li>
                        <li className='language_li'>
                            <button
                                className='lang-btn'
                                onClick={() => setLanguage("sp")}
                            >
                                <Image
                                    onClick={() => setLanguage("sp")}
                                    src={Spanish}
                                    alt="Spanish button"
                                    height={30} width={50} />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default TranslationComponent