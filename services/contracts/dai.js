export const checkBalance = async () => {
  // Get the account balance from the Dai contract
  const balance = await daiContract.balanceOf(account);
  // Convert the balance from a BigNumber to a number
  const number = JSON.parse(ethers.BigNumber.from(balance).toString());

  // Set the minimum balance value to 1 Dai
  const minimum = 1000000000000000000;

  // Return true if the account balance is greater than the minimum value, false otherwise
  return number > minimum;
};

export const checkApproved = async (daiContract, approvedAddress, tokenOwner) => {
  const approved = await daiContract.allowance(tokenOwner, approvedAddress);
  return approved.gt(0);
};