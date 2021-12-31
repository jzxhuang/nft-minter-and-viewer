import { nftContract } from "@/clients/alchemy-web-3"

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
export const getCurrentConnectedWallet = async (): Promise<string | undefined> => {
  if (typeof window.ethereum === "undefined") {
    throw new MetaMaskNotAvailableError()
  }

  const addressArray = await window.ethereum.request({
    method: "eth_accounts",
  })
  if (addressArray.length > 0) {
    return addressArray[0].toLowerCase()
  } else {
    return undefined
  }
}

export interface NftData {
  owner: string // address of owner
  tokenId: number
  tokenUri: string
}

/**
 * Gets the NFTs for a given wallet under our contract
 *
 * https://stackoverflow.com/questions/67460597/fetch-all-nfts-owned-by-wallet-address-with-web3-js
 */
export const getNftsForWallet = async (walletAddress: string) => {
  // The number of NFTs owned by this wallet.
  const balance = Number(await nftContract.methods.balanceOf(walletAddress).call())

  const promises: Promise<NftData>[] = []

  // Iterate through each NFT they own, getting the token Id and token Uri (as promise)
  for (let i = 0; i < balance; i++) {
    promises.push(
      new Promise(async (resolve) => {
        const tokenId = Number(await nftContract.methods.tokenOfOwnerByIndex(walletAddress, i).call())
        const tokenUri: string = await nftContract.methods.tokenURI(tokenId).call()

        resolve({ owner: walletAddress, tokenId, tokenUri })
      })
    )
  }

  return Promise.all(promises)
}

/**
 * Gets the NFTs for the contract, not paginated
 */
export const getAllNftsForContract = async () => {
  // The number of NFTs owned by this wallet.
  const totalSupply = Number(await nftContract.methods.totalSupply().call())

  const promises: Promise<NftData>[] = []

  // Iterate through each NFT they own, getting the token Id and token Uri (as promise)
  // WARNING: it's 1-indexed 🤦‍♀️
  for (let i = 1; i <= totalSupply; i++) {
    promises.push(
      new Promise(async (resolve) => {
        const index = i // assign this locally to persist it even after the frame is lost
        const res = await Promise.all([nftContract.methods.ownerOf(i).call(), nftContract.methods.tokenURI(i).call()])

        resolve({ owner: res[0], tokenId: index, tokenUri: res[1] })
      })
    )
  }

  return Promise.all(promises)
}
