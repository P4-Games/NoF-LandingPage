import { MongoClient } from 'mongodb';
import connectToDatabase from '../../utils/db';

const getUsersRank = async () => {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');

  const userRanking = await usersCollection.find().limit(10).toArray(); // Limitar a los primeros 10 jugadores

  const sortedRanking = userRanking.sort((a, b) => {
    const aMedalRank = calculateMedalRank(a.medals);
    const bMedalRank = calculateMedalRank(b.medals);

    if (aMedalRank > bMedalRank) {
      return -1;
    } else if (aMedalRank < bMedalRank) {
      return 1;
    } else {
      if (aMedalRank === 3 && bMedalRank === 3) {
        // Ambos tienen medallas de oro, comparar por cantidad de medallas de oro
        const aGoldMedals = countMedals(a.medals, 'gold');
        const bGoldMedals = countMedals(b.medals, 'gold');

        if (aGoldMedals > bGoldMedals) {
          return -1;
        } else if (aGoldMedals < bGoldMedals) {
          return 1;
        } else {
          // Ambos tienen la misma cantidad de medallas de oro, comparar por cantidad de personajes
          if (a.characters.length > b.characters.length) {
            return -1;
          } else if (a.characters.length < b.characters.length) {
            return 1;
          } else {
            return 0;
          }
        }
      } else {
        // No hay medallas de oro en ambos usuarios, comparar por cantidad de personajes
        if (a.characters.length > b.characters.length) {
          return -1;
        } else if (a.characters.length < b.characters.length) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  });

  const rankingList = sortedRanking.map((user, index) => {
    return {
      Position: index + 1,
      Nick: user.nick,
      Characters: user.characters.length,
      Medals: user.medals
    };
  });

  return rankingList;
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
