import { MongoClient } from 'mongodb';
import connectToDatabase from '../../utils/db';

// Función para calcular las medallas del usuario según la cantidad de personajes en su inventario
const calculateMedals = (characters, currentMedals) => {
  let medals = [...currentMedals]; // Copiar las medallas actuales en un nuevo arreglo

  const charactersCount = characters.length; // Obtener la cantidad de caracteres

  if (charactersCount >= 120) { // Verificar si se supera el límite de caracteres (120)
    if (medals.includes('bronze')) {
      // Si hay una medalla de bronce, convertirla en medalla de plata
      medals[medals.indexOf('bronze')] = 'silver';
    } else if (medals.includes('silver')) {
      // Si hay una medalla de plata, convertirla en medalla de oro
      medals[medals.indexOf('silver')] = 'gold';
    } else if (!medals.length || medals.includes('gold')) {
      // Si no tiene medallas o solo tiene medallas de oro, agregar una medalla de bronce
      medals.push('bronze');
    }
  }

  return medals; // Devolver el arreglo de medallas actualizado
};

// Función para obtener la información del usuario y actualizar sus medallas y personajes en la base de datos
const updateMedals = async (db, discordID) => {
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ discordID });

  if (!user) {
    throw new Error(`Usuario discordID: ${discordID} no resitrado. Para usar este comando debes previamente hacer **/start**`);
  }

  const { medals, characters } = user;

  const updatedMedals = calculateMedals(characters, medals);

  // Actualizar las medallas en la base de datos del usuario
  await usersCollection.updateOne(
    { discordID },
    { $set: { medals: updatedMedals, characters: [] } }
  );

  return updatedMedals;
};

// Manejador de la API para obtener las medallas de un usuario
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { discordID } = req.query;

    const db = await connectToDatabase();

    const medals = await updateMedals(db, discordID);

    res.status(200).json({ medals });
  } catch (error) {
    console.error(error);

    if (error.message.startsWith('Para usar este comando debes previamente hacer **/start**')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
}
