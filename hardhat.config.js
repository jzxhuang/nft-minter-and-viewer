/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config()
require("dotenv").config({ path: `.env.local` })
require("@nomiclabs/hardhat-ethers")

const { NEXT_PUBLIC_ALCHEMY_URL, NEXT_PUBLIC_ALCHEMY_KEY, ETH_PRIVATE_KEY } = process.env

module.exports = {
  solidity: "0.7.3",
  defaultNetwork: "ropsten",
  networks: {
    hardhat: {},
    ropsten: {
      url: `${NEXT_PUBLIC_ALCHEMY_URL}/${NEXT_PUBLIC_ALCHEMY_KEY}`,
      accounts: [`0x${ETH_PRIVATE_KEY}`],
    },
  },
}
