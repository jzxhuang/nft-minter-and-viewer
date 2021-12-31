import { useMutation, useQuery, useQueryClient } from "react-query"
import { getAllNftsForContract, getCurrentConnectedWallet, getNftsForWallet, getPublicAddress } from "utils/ethereum"

export const WALLET_ADDRESS_QUERY_KEY = "walletAddress"

export const useGetWalletAddressQuery = () =>
  useQuery([WALLET_ADDRESS_QUERY_KEY], getCurrentConnectedWallet, {
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
  })

export const useRequestWalletMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(getPublicAddress, {
    retry: false,
    onSuccess: (address) => {
      /** After mutating, set the query data for the wallet address query key */
      queryClient.setQueryData([WALLET_ADDRESS_QUERY_KEY], address)
    },
  })
}

const GET_NFTS_FOR_WALLET_QUERY_KEY = "getNftsForWallet"
export const useGetNftsForWalletQuery = (walletAddress?: string) => {
  return useQuery([GET_NFTS_FOR_WALLET_QUERY_KEY, walletAddress], () => getNftsForWallet(walletAddress!), {
    enabled: Boolean(walletAddress),
  })
}

const GET_ALL_NFTS_FOR_CONTRACT_QUERY_KEY = "getAllNftsForContract"
export const useGetAllNftsForContractQuery = () => {
  return useQuery([GET_ALL_NFTS_FOR_CONTRACT_QUERY_KEY], getAllNftsForContract)
}
