import { Alert, AlertIcon, Box, Flex, Grid, GridItem, Heading, Spinner } from "@chakra-ui/react"
import { NftItem } from "components/view-nfts/nft-item"
import { useGetNftsForWalletQuery } from "queries/ethereum/query-hooks"
import { NftGrid } from "./nft-grid"

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
          <NftGrid>
            {data.map((nft) => (
              <GridItem key={nft.tokenId}>
                <NftItem nftData={nft} />
              </GridItem>
            ))}
          </NftGrid>
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
