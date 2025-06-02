import { getUser } from "../../lib/database"

export default async function handler(req, res) {
  try {
    const result = getUser(req.email);
    res.status(200).send({ email: result })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
