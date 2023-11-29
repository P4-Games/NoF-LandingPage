import Swal from 'sweetalert2'

export function emitInfo(message, timer = 5000, title = '', showConfirmButton = true) {
  emitmsg(title, message, 'info', timer, showConfirmButton)
}

export function emitError(message, timer = 5000, title = '', showConfirmButton = true) {
  emitmsg(title, message, 'error', timer, showConfirmButton)
}

export function emitWarning(message, timer = 5000, title = '', showConfirmButton = true) {
  emitmsg(title, message, 'warning', timer, showConfirmButton)
}

export function emitSuccess(message, timer = 2000, title = '', showConfirmButton = false) {
  emitmsg(title, message, 'success', timer, showConfirmButton)
}

function emitmsg(title, message, icon, timer, showConfirmButton = true) {
  Swal.fire({
    title: title,
    text: message,
    icon: icon,
    timer: timer,
    showConfirmButton: showConfirmButton
  })
}
