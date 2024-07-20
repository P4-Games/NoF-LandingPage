import { nofVersion } from '../../../config'

export default async function handler(req, res) {
  res.status(200).json({ version: nofVersion })
}
