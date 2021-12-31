import contractAbi from "contracts/MyNFT.json"
import { createAlchemyWeb3 } from "@alch/alchemy-web3"

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY
const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL
if (!alchemyKey || !alchemyUrl) {
  throw new Error(".env not configured correclty, missing alchemy key or URL")
}

/** Alchemy Web3 Client */
export const alchemyWeb3Client = createAlchemyWeb3(`${alchemyUrl}/${alchemyKey}`)

/** The NFT contract */
//@ts-ignore
export const nftContract = new alchemyWeb3Client.eth.Contract(contractAbi, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
