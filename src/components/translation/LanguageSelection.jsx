import World from './images/world.png'
import Brazilean from './images/br.png'
import English from './images/en.png'
import Spanish from './images/es.png'
import Image from 'next/image.js'
import { useSettingsContext } from '../../hooks'

function LanguageSelection () {
  const { onToggleLanguageSetted } = useSettingsContext()

  if (typeof window !== 'undefined') {
    document.addEventListener('click', e => {
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
    })
  }


  const handleChangeLang = (newLang) => {
    onToggleLanguageSetted(newLang)
  }


  return (
    <>
      <div className='dropdown' data-dropdown>
        <button className='link' data-dropdown-button>
          <Image src={World} alt='language button' fill />
        </button>
        <div className='dropdown-menu'>
          <ul className='language_ul'>
            <li className='language_li'>
              <button
                className='lang-btn'
                onClick={() => handleChangeLang('en')}
              >
                <Image
                  onClick={() => handleChangeLang('en')}
                  src={English}
                  alt='English button'
                  height={30} width={50}
                />
              </button>
            </li>
            <li className='language_li'>
              <button
                className='lang-btn'
                onClick={() => handleChangeLang('br')}
              >
                <Image
                  onClick={() => handleChangeLang('br')}
                  src={Brazilean}
                  alt='Brazilean button'
                  height={30} width={50}
                />
              </button>
            </li>
            <li className='language_li'>
              <button
                className='lang-btn'
                onClick={() => handleChangeLang('es')}
              >
                <Image
                  onClick={() => handleChangeLang('es')}
                  src={Spanish}
                  alt='Spanish button'
                  height={30} width={50}
                />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default LanguageSelection
