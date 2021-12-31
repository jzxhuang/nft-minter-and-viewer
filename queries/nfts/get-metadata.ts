import axios from "axios"

export const getNftMetadata = async (uri: string) => {
  return (await axios.get(uri)).data
}
