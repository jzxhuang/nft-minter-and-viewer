/** MetaMask is not installed */
export class MetaMaskNotAvailableError extends Error {}

/** User rejected MetaMask account linking */
export class MetaMaskRejectedError extends Error {}

/**
 * Gets the wallet address using MetaMask. Adopted from https://docs.metamask.io/guide/getting-started.html#basic-considerations
 *
 * @throws {MetaMaskNotAvailable} No web3 provider is available in the browser
 * @throws {MetamaskRejected} The does not connect with metamask
 * @returns The connected wallet address in lowercase.
 */
export const getPublicAddress = async (): Promise<string> => {
  if (typeof window.ethereum === "undefined") {
    throw new MetaMaskNotAvailableError()
  }

  let publicAddress: string

  try {
    const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" })
    publicAddress = accounts[0]?.toLowerCase()
  } catch (err) {
    throw new MetaMaskRejectedError()
  }

  return publicAddress
}

/**
 * Gets the current connected wallet
 *
 * If no wallet is connected, returns null
 *
 * Otherwise, returns the connected wallet address in lowercase.
 */
export const getCurrentConnectedWallet = async (): Promise<string | null> => {
  if (typeof window.ethereum === "undefined") {
    throw new MetaMaskNotAvailableError()
  }

  const addressArray = await window.ethereum.request({
    method: "eth_accounts",
  })
  if (addressArray.length > 0) {
    return addressArray[0].toLowerCase()
  } else {
    return null
  }
}
