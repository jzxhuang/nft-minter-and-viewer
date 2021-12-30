import axios from "axios"

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET

if (!pinataApiKey || !pinataApiSecret) {
  throw new Error(".env not configured correctly, pinata API key or secret is missing")
}

export interface PinJsonToIpfsRequest extends Record<string, any> {
  name: string
  description: string
  /** URL to the image */
  image: string
}

/** https://docs.pinata.cloud/api-pinning/pin-json#response */
export interface PinJsonToIpfsResponse {
  /**
   * This is the IPFS multi-hash provided back for your content
   * i.e. you can fetch your asset from `https://gateway.pinata.cloud/ipfs/${IpfsHash}`
   */
  IpfsHash: string
  /** This is how large (in bytes) the content you just pinned is */
  PinSize: number
  /** This is the timestamp for your content pinning (represented in ISO 8601 format) */
  Timestamp: string
}

/**
 * Pins a JSON object to IPFS via Pinata
 * https://docs.pinata.cloud/api-pinning/pin-json
 */
export const pinJsonToIpfs = async (reqBody: PinJsonToIpfsRequest) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

  try {
    const resp = await axios.post<PinJsonToIpfsResponse>(url, reqBody, {
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataApiSecret,
      },
    })
    return resp.data
  } catch (err) {
    console.error("Error pinning JSON to IPFS", err)
    throw err
  }
}
