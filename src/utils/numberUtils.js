export function decToHex(number) {
  return `0x${parseInt(number, 10).toString(16)}`
}

export function hexToDec(str) {
  return parseInt(str, 16)
}
