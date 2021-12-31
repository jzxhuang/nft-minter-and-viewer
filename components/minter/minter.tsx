import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Code,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { FormEvent, useCallback, useEffect, useState } from "react"
import { MetaMaskNotAvailableError } from "utils/ethereum"
import { useMintNftMutation } from "queries/nfts/query-hooks"
import {
  useGetWalletAddressQuery,
  useRequestWalletMutation,
  WALLET_ADDRESS_QUERY_KEY,
} from "queries/ethereum/query-hooks"
import { useQueryClient } from "react-query"
import { ViewMyNfts } from "components/view-nfts/my-nfts"
import { AllNfts } from "components/view-nfts/all-nfts"

const Minter = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  // React state (form input fields)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [assetUrl, setAssetUrl] = useState("")

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

  /** Registers event listener for `accountsChanged` (when user changes account in MetMask, or disconnects account) */
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

  const handleSubmitForm = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!mintNftMutation.isLoading) {
        mintNftMutation.mutate({ name, description, image: assetUrl })
      }
    },
    [assetUrl, description, mintNftMutation, name]
  )

  return (
    <Container maxW="container.xl" py={6}>
      <Heading as="h1" size="2xl">
        🧙‍♂️ Simple NFT Minter and Viewer
      </Heading>

      <Box pt={6}>
        <Heading size="md" as="h2" pb={2}>
          {"Make sure you're on the Ropsten test network!"}
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

        <form onSubmit={handleSubmitForm}>
          <VStack align="left" py={6} spacing={5}>
            <FormControl isRequired>
              <FormLabel htmlFor="asseturl">🖼 Link to asset</FormLabel>
              <Input
                id="asseturl"
                type="text"
                placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
                onChange={(event) => setAssetUrl(event.target.value)}
                value={assetUrl}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="nftName">💡 Name</FormLabel>
              <Input
                id="nftName"
                type="text"
                placeholder="e.g. My first NFT!"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="nftDescription">✍️ Description</FormLabel>
              <Input
                id="nftDescription"
                type="text"
                placeholder="e.g. Even cooler than cryptokitties ;)"
                onChange={(event) => setDescription(event.target.value)}
                value={description}
              />
            </FormControl>
          </VStack>
          <Button
            colorScheme="blue"
            type="submit"
            disabled={!getWalletAddressQuery.data}
            isLoading={mintNftMutation.isLoading}
          >
            Mint NFT
          </Button>
        </form>
        {mintNftMutation.data && (
          <Alert status="success" variant="solid" maxW="100%" mt={4}>
            <AlertIcon />
            <Box maxW="100%" overflowX="auto">
              {"✅ Check out your transaction on Etherscan: "}
              <Link
                href={`https://ropsten.etherscan.io/tx/${mintNftMutation.data}`}
                target="_blank"
                rel="noreferrer"
              >{`https://ropsten.etherscan.io/tx/${mintNftMutation.data}`}</Link>
            </Box>
          </Alert>
        )}
      </Box>

      {getWalletAddressQuery.data && <ViewMyNfts walletAddress={getWalletAddressQuery.data} />}

      <AllNfts />
    </Container>
  )
}

export default Minter
