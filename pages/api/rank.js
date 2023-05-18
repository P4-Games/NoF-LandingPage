import { MongoClient } from 'mongodb';
import connectToDatabase from '../../utils/db';

const getUsersRank = async () => {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');

  const userRanking = await usersCollection.aggregate([
    { $project: { nick: 1, characters: { $size: "$characters" } } },
    { $sort: { characters: -1 } },
    { $limit: 10 }
  ]).toArray();

  const rankingList = userRanking.map((user, index) => {
    return {
      Position: index + 1,
      Nick: user.nick,
      Characters: user.characters
    };
  });

  return rankingList;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const usersRank = await getUsersRank();

    res.status(200).json(usersRank);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
