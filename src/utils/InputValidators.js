export const checkInputAddress = (address, myOwnWallet) => {
  const hexa = '0123456789abcdefABCDEF'
  if (
    address.length !== 42 ||
    address[0] !== '0' ||
    address[1] !== 'x' ||
    address.toLowerCase() === myOwnWallet.toLowerCase()
  ) {
    return false
  }
  for (let i = 2; i < address.length; i++) {
    if (!hexa.includes(address[i])) {
      return false
    }
  }
  return true
}

export const checkInputArrayCardNumbers = (text, myCardNumber) => {

  // Expresión regular para validar números y comas
  const regex = /^([0-9]|1[0-1][0-9]|[1-9]?[0-9])(,([0-9]|1[0-1][0-9]|[1-9]?[0-9]))*$/;



  // Comprobar si el texto coincide con la expresión regular
  if (!regex.test(text)) {
    return false
  }

  // Verificar si el texto está vacío o excede el límite de 10 valores
  const allValues = text.split(',');
  if (allValues.length > 10 || text.trim() === '') {
    return false
  }

  // Verificar si hay números repetidos
  const numbers = allValues.map(val => parseInt(val.trim(), 10))
  const duplicates = new Set(numbers).size !== numbers.length
  if (duplicates) {
    return false
  }

  // Verificar si el número es myCardNumber (no debe coincidir con este número)
  if (numbers.includes(myCardNumber)) {
    return false
  }

  return true
}

