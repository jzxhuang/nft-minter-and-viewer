import { useMutation, useQuery } from "react-query"

import { getNftMetadata } from "@/queries/nfts/get-metadata"
import { mintNft } from "@/queries/nfts/mint-nft"

const GET_NFT_METADATA_QUERY_KEY = "getNftMetadata"
export const useGetNftMetadataQuery = (uri: string) =>
  useQuery([GET_NFT_METADATA_QUERY_KEY, uri], () => getNftMetadata(uri))

export const useMintNftMutation = () => useMutation(mintNft, { retry: false })
