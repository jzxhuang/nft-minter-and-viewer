import type { NextApiRequest, NextApiResponse } from "next"

import { PinJsonToIpfsRequest, PinJsonToIpfsResponse, pinJsonToIpfs } from "@/queries/pinata"

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET

if (!pinataApiKey || !pinataApiSecret) {
  throw new Error(".env not configured correctly, pinata API key or secret is missing")
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: PinJsonToIpfsRequest
}

/** Proxies request to Pinata API, with correct API keys */
export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse<PinJsonToIpfsResponse>) {
  const { method } = req
  switch (method) {
    case "POST":
      const pinataResponse = await pinJsonToIpfs(req.body)
      res.json(pinataResponse)
      break

    default:
      res.setHeader("Allow", ["POST"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
