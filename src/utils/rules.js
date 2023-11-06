export const showRules = () => {
  document.getElementsByClassName('main_buttons_container')[0].style.display = 'none'
  document.getElementsByClassName('rules_container')[0].style.display = 'block'
  window.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
      document.getElementsByClassName('main_buttons_container')[0].style.display = 'flex'
      document.getElementsByClassName('rules_container')[0].style.display = 'none'
    }
  })
}

export const closeRules = () => {
  document.getElementsByClassName('main_buttons_container')[0].style.display = 'flex'
  document.getElementsByClassName('rules_container')[0].style.display = 'none'
}
