import { MongoClient } from 'mongodb';
import connectToDatabase from '../../utils/db';

const getRandomCharacterID = async (db, channelId) => {
  const serversCollection = db.collection('servers');
  const server = await serversCollection.findOne({ channelId });

  if (!server) {
    throw new Error(`Server not found for channelId: ${channelId}`);
  }

  const characterID = server.nofy;

  if (characterID === null) {
    return null; // Personaje ya fue reclamado
  } else if (!characterID) {
    throw new Error('Random number not found');
  }

  return characterID;
};

const findUserByDiscordID = async (db, discordID) => {
  const collection = db.collection('users');
  const user = await collection.findOne({ discordID });

  if (!user) {
    throw new Error(`User not found for discordID: ${discordID}`);
  }

  return user;
};

const findCharacterByID = async (db, characterID) => {
  const characterImage = `https://storage.googleapis.com/nof-gamma/T1/${characterID}.png`;
  const charactersCollection = db.collection('characters');
  const character = await charactersCollection.findOne({ image: characterImage });

  if (!character) {
    throw new Error(`Character not found or missing image for characterID: ${characterID}`);
  }

  return { id: characterID, image: characterImage };
};

const addCharacterToInventory = async (db, userID, characterID, characterImage) => {
  const userCollection = db.collection('users');

  await userCollection.updateOne({ _id: userID }, { $addToSet: { characters: { id: characterID, image: characterImage } } });
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { discordID, channelID } = req.body;

    const db = await connectToDatabase();
    const user = await findUserByDiscordID(db, discordID);
    if (!user) {
      return res.status(200).json({ message: `User not found for discordID: ${discordID}` });
    }

    const characterID = await getRandomCharacterID(db, channelID);
    if (characterID === null) {
      return res.status(200).json({ message: 'Personaje ya fue reclamado' });
    }

    const character = user.characters.find(c => c.id.toString() === characterID.toString());
    if (character) {
      return res.status(200).json({ message: 'Ya tienes este personaje en tu inventario' });
    }

    const characterObj = await findCharacterByID(db, characterID);
    await addCharacterToInventory(db, user._id, characterObj.id, characterObj.image);

    const serversCollection = db.collection('servers');
    await serversCollection.updateOne({ channelId: channelID }, { $set: { nofy: null } });

    res.status(200).json({ message: 'Personaje agregado correctamente', image: characterObj.image });
  } catch (error) {
    console.error(error);

    if (
      error.message.startsWith('Server not found') ||
      error.message.startsWith('User not found') ||
      error.message.startsWith('Character not found')
    ) {
      res.status(200).json({ message: error.message });
    } else {
      res.status(200).json({ message: 'Server error' });
    }
  }
}
