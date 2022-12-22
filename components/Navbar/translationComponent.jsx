import useTranslation from "./useTranslation.jsx"
import Br from './icons/br.png'
import En from './icons/en.png'
import Sp from './icons/es.png'

function TranslationComponent() {
    /*document.addEventListener('click', e => {
        const isDropdownButton = e.target.matches('[data-dropdown-button]')
        if (!isDropdownButton && e.target.closest('[data-dropdown]') != null) return

        let currentDropdown
        if (isDropdownButton) {
            currentDropdown = e.target.closest('[data-dropdown]')
            currentDropdown.classList.toggle('active')
        }
        document.querySelectorAll('[data-dropdown].active').forEach(dropdown => {
            if (dropdown === currentDropdown) return
            dropdown.classList.remove('active')
        })
    })*/

    const { language, setLanguage, setFallbackLanguage, t } = useTranslation
    ()

    return (
        <>
            <div className='dropdown' data-dropdown>
                <button className='link' data-dropdown-button> {t('collections')} </button>
                <div className='dropdown-menu'>
                    <div>
                        <ul>
                            <button onClick={() => setLanguage("En")}>
                                <Image src={En} alt="" layout='fill' />
                            </button>
                            <button onClick={() => setLanguage("Br")}>
                                <Image src={Br} alt="" layout='fill' />
                            </button>
                            <button onClick={() => setLanguage("Sp")}>
                                <Image src={Sp} alt="" layout='fill' />
                            </button>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TranslationComponent