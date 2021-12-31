import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Input, Link, VStack, useToast } from "@chakra-ui/react"
import { FormEvent, useCallback, useEffect, useState } from "react"

import { useGetWalletAddressQuery } from "@/queries/ethereum/query-hooks"
import { useMintNftMutation } from "@/queries/nfts/query-hooks"

const Minter = () => {
  const toast = useToast()

  // React state (form input fields)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [assetUrl, setAssetUrl] = useState("")

  /** Fetch the wallet address on mount */
  const getWalletAddressQuery = useGetWalletAddressQuery()

  const mintNftMutation = useMintNftMutation()

  useEffect(() => {
    if (mintNftMutation.error) {
      toast({
        title: `Something went wrong while minting your NFT :(`,
        isClosable: true,
        status: "error",
      })
    }
  }, [mintNftMutation.error, toast])

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
    <Box>
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
  )
}

export default Minter
