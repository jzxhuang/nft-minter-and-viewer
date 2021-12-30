require("dotenv").config()
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")

const API_URL = process.env.API_URL
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PUBLIC_KEY = process.env.PUBLIC_KEY

const web3 = createAlchemyWeb3(API_URL)

const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS)

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: CONTRACT_ADDRESS,
    nonce: nonce,
    gas: 500000,
    maxPriorityFeePerGas: 1999999987,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  }

  const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

  console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`)
}

mintNFT("https://gateway.pinata.cloud/ipfs/QmeDwUzsb1r45tZjMEBLi7HsSpt6JYrY4TPaYzMvVcGnVV")
