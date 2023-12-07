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

export const checkFloatValue1GTValue2 = (value1, value2) => {
  const n1 = parseFloat(value1)
  const n2 = parseFloat(value2)

  if (isNaN(n1) || isNaN(n2)) {
    return false
  }
  return n1 <= n2
}

export const checkIntValue1GTValue2 = (value1, value2, validIFValue1Zero = false) => {
  const type1 = Number.isInteger(value1)
  const type2 = Number.isInteger(value2)

  if (!type1 || !type2) return false

  const n1 = parseInt(value1)
  const n2 = parseInt(value2)

  if (validIFValue1Zero && n1 === 0) return false

  if (isNaN(n1) || isNaN(n2)) {
    return false
  }
  return n1 <= n2
}
