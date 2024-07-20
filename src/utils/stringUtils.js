export const capitalizeFirstLetter = (word) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()

export const getAccountAddressText = (walletAddress) => {
  if (walletAddress <= 15 || !walletAddress) {
    return walletAddress
  }
  const firstPart = walletAddress.substring(0, 7)
  const lastPart = walletAddress.substring(walletAddress.length - 5)
  return `${firstPart}...${lastPart}`
}

export function removeQuotes(text) {
  if (text === '' || !text) return text
  return text.replace(/['"]/g, '')
}
