import { Grid, GridProps, forwardRef } from "@chakra-ui/react"

export const NftGrid = forwardRef<GridProps, "div">((props, ref) => {
  return <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} ref={ref} {...props} />
})
