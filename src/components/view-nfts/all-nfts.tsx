import { Alert, AlertIcon, Box, Flex, GridItem, Heading, Spinner } from "@chakra-ui/react"

import { NftItem } from "@/components/view-nfts/nft-item"
import { useGetAllNftsForContractQuery } from "@/queries/ethereum/query-hooks"

import { NftGrid } from "./nft-grid"

export const AllNfts = () => {
  const { data } = useGetAllNftsForContractQuery()

  return (
    <Box py={6}>
      <Heading size="lg" pb={3}>
        All NFTs
      </Heading>

      {data ? (
        data.length > 0 ? (
          <NftGrid>
            {data.map((nft) => (
              <GridItem key={nft.tokenId}>
                <NftItem nftData={nft} showAddress />
              </GridItem>
            ))}
          </NftGrid>
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
