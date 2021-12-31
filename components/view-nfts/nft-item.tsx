import { Box, Skeleton, VStack, Flex, Heading, Divider, Text, Image } from "@chakra-ui/react"
import { useGetNftMetadataQuery } from "queries/nfts/query-hooks"
import { NftData } from "utils/ethereum"

export const NftItem = (props: { nftData: NftData; showAddress?: boolean }) => {
  const { nftData, showAddress } = props

  const { data } = useGetNftMetadataQuery(nftData.tokenUri)

  return (
    <Box height="325px" px={6} py={4} borderRadius="md" borderColor="gray.200" borderWidth="1px">
      <Skeleton height="100%" isLoaded={Boolean(data)}>
        {data && (
          <VStack spacing={2} h="100%">
            <VStack spacing={2} w="100%" align="flex-start">
              <Flex justify="space-between" w="100%">
                <Heading size="md">{data.name}</Heading>
                <Heading size="sm">{`#${nftData.tokenId}`}</Heading>
              </Flex>
              <Text color="gray.500">{data.description}</Text>
              {showAddress && <Text fontSize="xs" color="gray.500">{`Owner: ${nftData.owner}`}</Text>}
              <Divider mt={1} orientation="horizontal" />
            </VStack>

            <Flex align="center" flex={1} h="100%" minH="0">
              <Image maxH="100%" minH={0} src={data.image} alt={data.description} borderRadius="md" />
            </Flex>
          </VStack>
        )}
      </Skeleton>
    </Box>
  )
}
