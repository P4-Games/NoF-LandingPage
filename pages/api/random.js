import connectToDatabase from '../../utils/db';

export default async function handler(req, res) {
  try {
    const { serverId } = req.body; // Obtener el serverID desde el cuerpo de la solicitud
    const db = await connectToDatabase();
    const serversCollection = db.collection('servers');

    // Generar un nuevo número aleatorio
    const newRandomInt = Math.floor(Math.random() * 120);

    // Actualizar el número aleatorio en la base de datos para el serverID especificado
    await serversCollection.updateOne({ serverId: serverId }, { $set: { nofy: newRandomInt } });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(newRandomInt);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}
