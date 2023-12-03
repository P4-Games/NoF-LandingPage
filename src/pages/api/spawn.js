import connectToDatabase from '../../utils/db'

export default async function handler(req, res) {
  const { serverId, channelId } = req.body

  try {
    const db = await connectToDatabase()
    const serversCollection = db.collection('servers')

    // Verificar si el servidor ya está registrado en la base de datos
    const existingServer = await serversCollection.findOne({ serverId })

    if (existingServer) {
      // Actualizar el canal del servidor existente
      await serversCollection.updateOne({ serverId }, { $set: { channelId } })
    } else {
      // Registrar un nuevo servidor y canal
      await serversCollection.insertOne({
        serverId,
        channelId
      })
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({
      message: 'Registration successful.'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'An error occurred while processing the request.'
    })
  }
}
