export const showRules = (class_prefix) => {
  document.getElementsByClassName('main_buttons_container')[0].style.display = 'none'
  document.getElementsByClassName(`${class_prefix}_rules_container`)[0].style.display = 'block'
  window.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
      document.getElementsByClassName('main_buttons_container')[0].style.display = 'flex'
      document.getElementsByClassName(`${class_prefix}_rules_container`)[0].style.display = 'none'
    }
  })
}

export const closeRules = (class_prefix) => {
  document.getElementsByClassName('main_buttons_container')[0].style.display = 'flex'
  document.getElementsByClassName(`${class_prefix}_rules_container`)[0].style.display = 'none'
}
