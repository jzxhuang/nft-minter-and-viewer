import { Alert, AlertIcon, Box, Flex, Grid, GridItem, Heading, Spinner } from "@chakra-ui/react"
import { NftItem } from "components/view-nfts/nft-item"
import { useGetNftsForWalletQuery } from "queries/ethereum/query-hooks"

interface ViewMyNftsProps {
  walletAddress: string
}

export const ViewMyNfts = (props: ViewMyNftsProps) => {
  const { walletAddress } = props

  const { data } = useGetNftsForWalletQuery(walletAddress)

  return (
    <Box py={6}>
      <Heading size="lg" pb={3}>
        Your NFTs
      </Heading>

      {data ? (
        data.length > 0 ? (
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            {data.map((nft) => (
              <GridItem key={nft.tokenId}>
                <NftItem nftData={nft} />
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Heading size="sm">{"You don't own any yet :("}</Heading>
          </Alert>
        )
      ) : (
        <Flex height="250px" justify="center" align="center">
          <Spinner size="lg" />
        </Flex>
      )}
    </Box>
  )
}
