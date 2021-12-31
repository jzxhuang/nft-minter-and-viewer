import { Center, ChakraProvider, Icon, Link } from "@chakra-ui/react"
import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { FaGithub } from "react-icons/fa"

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 20000 } } })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ChakraProvider>
        <Component {...pageProps} />
        <footer>
          <Center pb={2}>
            <Link
              display="inline-block"
              href="https://github.com/jzxhuang/nft-minter-and-viewer"
              aria-label="Github"
              isExternal
            >
              <Icon as={FaGithub} fontSize="xl" />
            </Link>
          </Center>
        </footer>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default MyApp
