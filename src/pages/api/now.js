import connectToDatabase from '../../utils/db'

export default async function handler(req, res) {
  const { channelId } = req.query

  try {
    const db = await connectToDatabase()
    const serversCollection = db.collection('servers')

    // Generar un nuevo número aleatorio
    const newRandomInt = Math.floor(Math.random() * 120)

    // Actualizar el número aleatorio en la base de datos para el channelId proporcionado
    if (newRandomInt === 0) {
      await serversCollection.updateOne({ channelId }, { $set: { nofy: 0 } })
    } else {
      await serversCollection.updateOne({ channelId }, { $set: { nofy: newRandomInt } })
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(newRandomInt)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'An error occurred while processing your request.'
    })
  }
}
