import axios from "axios"
import { PinJsonToIpfsRequest, PinJsonToIpfsResponse } from "./pinata"

/**
 * Pins a JSON object to IPFS by calling our backend (which proxies a request to Pinata)
 */
export const pinJson = async (reqBody: PinJsonToIpfsRequest) => {
  const url = `/api/ipfs/pinJson`
  const resp = await axios.post<PinJsonToIpfsResponse>(url, reqBody)
  return { ...resp.data, pinataUrl: `https://gateway.pinata.cloud/ipfs/${resp.data.IpfsHash}` }
}
