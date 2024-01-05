import { combinedVariables } from '../../config'

export default async function handler(req, res) {
  try {
    const { q1 } = req.query
    const _q1 = q1 === 'churrito2015'

    if (!_q1) {
      return res.status(401).json({ error: 'Q1 invalid' })
    }

    console.log('server', combinedVariables)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(combinedVariables)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'An error occurred while processing your request.'
    })
  }
}
