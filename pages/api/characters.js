import connectToDatabase from '../../utils/db';

export default async function handler(req, res) {
  const { query: { discordID } } = req;

  if (!discordID) {
    return res.status(400).json({ error: "Discord ID is missing from query parameters." });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const charactersCollection = db.collection("characters");

    // Buscar el usuario por su discordID
    const user = await usersCollection.findOne({ discordID });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Obtener los personajes del usuario y devolver sus imágenes
    const characters = await charactersCollection.find({ id: { $in: user.characters.map((c) => c.id) } }).toArray();
    const characterImages = characters.map((c) => c.image).join(" ");
    const numCharacters = characters.length;
    const totalCharacters = 120;

    return res.status(200).send(`${characterImages} Personajes atrapados: ${numCharacters} de ${totalCharacters}.`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
}
