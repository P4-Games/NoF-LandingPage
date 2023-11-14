export const checkInputAddress = (address) => {
  const hexa = '0123456789abcdefABCDEF'
  if (
    address.length !== 42 ||
    address[0] !== '0' ||
    address[1] !== 'x'
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

