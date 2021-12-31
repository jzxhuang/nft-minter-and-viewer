import { Alert, AlertIcon, Box, Flex, Grid, GridItem, Heading, Spinner } from "@chakra-ui/react"
import { NftItem } from "components/view-nfts/nft-item"
import { useGetAllNftsForContractQuery } from "queries/ethereum/query-hooks"

export const AllNfts = () => {
  const { data } = useGetAllNftsForContractQuery()

  return (
    <Box py={6}>
      <Heading size="lg" pb={3}>
        All NFTs
      </Heading>

      {data ? (
        data.length > 0 ? (
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            {data.map((nft) => (
              <GridItem key={nft.tokenId}>
                <NftItem nftData={nft} showAddress />
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Heading size="sm">{"No NFTs minted yet :("}</Heading>
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
