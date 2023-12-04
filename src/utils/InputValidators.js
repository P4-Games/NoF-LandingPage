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

export const checkValue1GTValue2 = (value1, value2) => {
  const n1 = parseFloat(value1)
  const n2 = parseFloat(value2)

  if (isNaN(n1) || isNaN(n2)) {
    return false
  }
  return n1 <= n2
}
