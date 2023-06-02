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

  const userRanking = await usersCollection.find().toArray();
  const sortedRanking = calculateRank(userRanking);
  const userPosition = sortedRanking.findIndex(item => item.nick === user.nick) + 1;

  return {
    Nick: user.nick,
    DiscordID: user.discordID,
    CharactersInInventory: charactersCount,
    InventoryCompletion: inventoryCompletion,
    UsersRegistered: usersCount,
    CharactersCaptured: charactersCaptured[0].count,
    Ranking: userPosition
  };
};

const calculateRank = (users) => {
  return users.sort((a, b) => {
    const aMedalRank = calculateMedalRank(a.medals);
    const bMedalRank = calculateMedalRank(b.medals);

    if (aMedalRank > bMedalRank) {
      return -1;
    } else if (aMedalRank < bMedalRank) {
      return 1;
    } else {
      if (aMedalRank === 3 && bMedalRank === 3) {
        const aGoldMedals = countMedals(a.medals, 'gold');
        const bGoldMedals = countMedals(b.medals, 'gold');

        if (aGoldMedals > bGoldMedals) {
          return -1;
        } else if (aGoldMedals < bGoldMedals) {
          return 1;
        } else {
          return compareCharacters(a, b);
        }
      } else {
        return compareCharacters(a, b);
      }
    }
  });
};

const calculateMedalRank = (medals) => {
  if (medals.includes('gold')) {
    return 3;
  } else if (medals.includes('silver')) {
    return 2;
  } else if (medals.includes('bronze')) {
    return 1;
  } else {
    return 0;
  }
};

const countMedals = (medals, medalType) => {
  return medals.filter(medal => medal === medalType).length;
};

const compareCharacters = (a, b) => {
  if (a.characters.length > b.characters.length) {
    return -1;
  } else if (a.characters.length < b.characters.length) {
    return 1;
  } else {
    return 0;
  }
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
