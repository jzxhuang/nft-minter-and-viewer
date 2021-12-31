import { Alert, AlertIcon, Box, Button, Code, Container, Heading, Link, Text, useToast } from "@chakra-ui/react"
import type { NextPage } from "next"
import Head from "next/head"
import { useCallback, useEffect } from "react"
import { useQueryClient } from "react-query"

import Minter from "@/components/minter/minter"
import { AllNfts } from "@/components/view-nfts/all-nfts"
import { ViewMyNfts } from "@/components/view-nfts/my-nfts"
import {
  WALLET_ADDRESS_QUERY_KEY,
  useGetWalletAddressQuery,
  useRequestWalletMutation,
} from "@/queries/ethereum/query-hooks"
import { useMintNftMutation } from "@/queries/nfts/query-hooks"
import { MetaMaskNotAvailableError } from "@/utils/ethereum"

const Home: NextPage = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  /** Fetch the wallet address on mount */
  const getWalletAddressQuery = useGetWalletAddressQuery()

  /** Mutation for requesting wallet address from MetaMask */
  const requestWalletAddressMutation = useRequestWalletMutation()
  const mintNftMutation = useMintNftMutation()

  // Error handlers
  useEffect(() => {
    if (getWalletAddressQuery.error) {
      toast({
        title:
          getWalletAddressQuery.error instanceof MetaMaskNotAvailableError
            ? "Please install MetaMask"
            : `An error has occurred`,
        status: "error",
        isClosable: true,
      })
    }
  }, [getWalletAddressQuery.error, toast])
  useEffect(() => {
    if (requestWalletAddressMutation.error) {
      toast({
        title:
          requestWalletAddressMutation.error instanceof MetaMaskNotAvailableError
            ? "Please install MetaMask"
            : `An error has occurred while connecting your wallet`,
        status: "error",
        isClosable: true,
      })
    }
  }, [requestWalletAddressMutation.error, toast])
  useEffect(() => {
    if (mintNftMutation.error) {
      toast({
        title: `Something went wrong while minting your NFT :(`,
        isClosable: true,
        status: "error",
      })
    }
  }, [mintNftMutation.error, toast])

  /** Registers event listener for `accountsChanged` (when user changes account in MetaMask, or disconnects account) */
  useEffect(() => {
    function handleAccountsChanged(accounts: string[]) {
      console.log(
        "accountsChanged, previous data, newData:",
        accounts,
        queryClient.getQueryData([WALLET_ADDRESS_QUERY_KEY]),
        accounts[0]?.toLowerCase()
      )
      queryClient.setQueryData([WALLET_ADDRESS_QUERY_KEY], accounts[0]?.toLowerCase())
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [queryClient])

  const handleConnectWallet = useCallback(() => {
    requestWalletAddressMutation.mutate()
  }, [requestWalletAddressMutation])

  return (
    <>
      <Head>
        <title>My NFT Minter</title>
        <meta name="description" content="A simple NFT Minter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="container.xl" py={6}>
        <Heading as="h1" size="2xl">
          🧙‍♂️ Simple NFT Minter and Viewer
        </Heading>

        <Box pt={6}>
          <Heading size="md" as="h2" pb={2}>
            {"Make sure you're on the Ropsten test network! See "}
            <Link
              href="https://www.openattestation.com/docs/appendix/ropsten-setup/"
              isExternal
              textDecoration="underline"
            >
              https://www.openattestation.com/docs/appendix/ropsten-setup/
            </Link>{" "}
            for instructions
          </Heading>
          {getWalletAddressQuery.data ? (
            <Alert status="success">
              <AlertIcon />
              <Heading size="sm" title={getWalletAddressQuery.data}>
                {"Connected wallet: "}
                <Code>{`${String(getWalletAddressQuery.data).substring(0, 6)}...${String(
                  getWalletAddressQuery.data
                ).substring(38)}`}</Code>
              </Heading>
            </Alert>
          ) : (
            <Button
              disabled={getWalletAddressQuery.isLoading || requestWalletAddressMutation.isLoading}
              isLoading={getWalletAddressQuery.isLoading || requestWalletAddressMutation.isLoading}
              variant="outline"
              colorScheme="cyan"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </Button>
          )}
          <Text pt={4}>{`Simply add your asset's link, name, and description, then press "Mint."`}</Text>

          <Minter />
          {getWalletAddressQuery.data && <ViewMyNfts walletAddress={getWalletAddressQuery.data} />}
          <AllNfts />
        </Box>
      </Container>
    </>
  )
}

export default Home
