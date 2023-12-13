export const capitalizeFirstLetter = (word) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()

export const getAccountAddressText = (walletAddress) => {
  if (walletAddress <= 15 || !walletAddress) {
    return walletAddress
  } else {
    const firstPart = walletAddress.substring(0, 7)
    const lastPart = walletAddress.substring(walletAddress.length - 5)
    return `${firstPart}...${lastPart}`
  }
}
