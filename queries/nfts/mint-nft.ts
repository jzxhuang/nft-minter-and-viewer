import { nftContract } from "clients/alchemy-web-3"
import { pinJson } from "queries/ipfs"
import { PinJsonToIpfsRequest } from "queries/pinata"
import { useMutation } from "react-query"

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE" // alchemy's demo contract

/**
 * Mints an NFT
 *
 * - creates the metadata on IPFS through pinata
 * - creates the transaction, calling the `mintNft` method of our contract and asking the user to sign the transaction
 */
export const mintNft = async (jsonMetadata: PinJsonToIpfsRequest) => {
  const pinataResponse = await pinJson(jsonMetadata)

  //load smart contract
  // @ts-ignore
  window.contract = nftContract

  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods.mintNFT(window.ethereum.selectedAddress, pinataResponse.pinataUrl).encodeABI(), //make call to NFT smart contract
  }

  //sign transaction via Metamask
  try {
    const txHash: string = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    })
    return txHash
  } catch (err) {
    console.error("Error while minting NFT", err)
    throw err
  }
}
