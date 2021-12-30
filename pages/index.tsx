import type { NextPage } from "next"
import Head from "next/head"

import Minter from "components/minter/minter"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>My NFT Minter</title>
        <meta name="description" content="A simple NFT Minter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Minter />
    </>
  )
}

export default Home
