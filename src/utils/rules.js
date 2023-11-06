export const showRules = () => {
  document.getElementsByClassName('alpha_main_buttons_container')[0].style.display = 'none'
  document.getElementsByClassName('alpha_rules_container')[0].style.display = 'block'
  window.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
      document.getElementsByClassName('alpha_rules_container')[0].style.display = 'none'
      document.getElementsByClassName('alpha_main_buttons_container')[0].style.display = 'flex'
    }
  })
}

export const closeRules = () => {
  document.getElementsByClassName('alpha_main_buttons_container')[0].style.display = 'flex'
  document.getElementsByClassName('alpha_rules_container')[0].style.display = 'none'
}
