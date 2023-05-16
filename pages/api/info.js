import { MongoClient } from 'mongodb';
import connectToDatabase from '../../utils/db';

const getUserInfo = async (db, discordID) => {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ discordID });
  
    if (!user) {
      throw new Error(`User not found for discordID: ${discordID}`);
    }
  
    const charactersCount = user.characters.length;
    const inventoryCompletion = Math.floor((charactersCount / 120) * 100);
  
    const usersCount = await usersCollection.countDocuments();
    const charactersCaptured = await usersCollection.aggregate([
      { $project: { _id: 0, characters: 1 } },
      { $unwind: "$characters" },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]).toArray();
  
    return {
      Nick: user.nick,
      DiscordID: user.discordID,
      CharactersInInventory: charactersCount,
      InventoryCompletion: inventoryCompletion,
      UsersRegistered: usersCount,
      CharactersCaptured: charactersCaptured[0].count
    };
  };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { discordID } = req.query;

    const db = await connectToDatabase();
    const userInfo = await getUserInfo(db, discordID);

    res.status(200).json(userInfo);
  } catch (error) {
    console.error(error);

    if (error.message.startsWith('User not found')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
}
