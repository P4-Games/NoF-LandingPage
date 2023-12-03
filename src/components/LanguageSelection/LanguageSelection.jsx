import React, { useState } from 'react'
import Image from 'next/image'
import { useSettingsContext } from '../../hooks'

function LanguageSelection() {
  const { onToggleLanguageSetted } = useSettingsContext()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  if (typeof window !== 'undefined') {
    document.addEventListener('click', (e) => {
      const isDropdownButton = e.target.matches('[data-dropdown-button]')
      if (!isDropdownButton && e.target.closest('[data-dropdown]') != null) return

      let currentDropdown
      if (isDropdownButton) {
        currentDropdown = e.target.closest('[data-dropdown]')
        currentDropdown.classList.toggle('active')
      }
      document.querySelectorAll('[data-dropdown].active').forEach((dropdown) => {
        if (dropdown === currentDropdown) return
        dropdown.classList.remove('active')
      })
    })
  }

  const handleChangeLang = (newLang) => {
    if (dropdownOpen) {
      onToggleLanguageSetted(newLang)
      setDropdownOpen(false)
    }
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <>
      <div className='dropdown' data-dropdown>
        <button className='link' data-dropdown-button onClick={toggleDropdown}>
          <Image src={'/images/navbar/world.png'} alt='language button' fill />
        </button>
        {dropdownOpen && (
          <div className='dropdown-menu '>
            <ul className='language_ul'>
              <li className='language_li'>
                <button className='lang-btn' onClick={() => handleChangeLang('en')}>
                  <Image
                    onClick={() => handleChangeLang('en')}
                    src={'/images/flags/en.png'}
                    alt='English button'
                    height={30}
                    width={50}
                  />
                </button>
              </li>
              <li className='language_li'>
                <button className='lang-btn' onClick={() => handleChangeLang('br')}>
                  <Image
                    onClick={() => handleChangeLang('br')}
                    src={'/images/flags/br.png'}
                    alt='Brazilean button'
                    height={30}
                    width={50}
                  />
                </button>
              </li>
              <li className='language_li'>
                <button className='lang-btn' onClick={() => handleChangeLang('es')}>
                  <Image
                    onClick={() => handleChangeLang('es')}
                    src={'/images/flags/es.png'}
                    alt='Spanish button'
                    height={30}
                    width={50}
                  />
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default LanguageSelection
