import { alchemyWeb3Client } from "clients/alchemy-web-3"
import contractAbi from "contracts/MyNFT.json"
import { pinJson } from "queries/ipfs"
import { PinJsonToIpfsRequest } from "queries/pinata"
import { useMutation } from "react-query"

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE" // alchemy's demo contract

/**
 * Mints an NFT by calling the `mintNFT` method of our contract
 * and asking the user to sign the MetaMask transaction
 */
export const mintNFT = async (jsonMetadata: PinJsonToIpfsRequest) => {
  const pinataResponse = await pinJson(jsonMetadata)

  //load smart contract
  // @ts-ignore
  window.contract = new alchemyWeb3Client.eth.Contract(contractAbi, contractAddress) //loadContract();

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

export const useMintNftMutation = () => useMutation(mintNFT, { retry: false })
