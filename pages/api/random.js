import connectToDatabase from '../../utils/db';

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();
    const randomNumberCollection = db.collection("random");

    // Generar un nuevo número aleatorio
    const newRandomInt = Math.floor(Math.random() * 120);

    // Actualizar el número aleatorio en la base de datos
    await randomNumberCollection.updateOne({}, { $set: { number: newRandomInt } });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(newRandomInt);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};
