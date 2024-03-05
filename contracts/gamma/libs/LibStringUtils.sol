// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LibStringUtils {

  // Inspired by OraclizeAPI's implementation - MIT licence
  // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol#L15-L35
  function toString(uint256 value) public pure returns (string memory) {

    if (value == 0) {
        return "0";
    }
    uint256 temp = value;
    uint256 digits;
    while (temp != 0) {
        digits++;
        temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (value != 0) {
        digits -= 1;
        buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
        value /= 10;
    }
    return string(buffer);
  }

}
