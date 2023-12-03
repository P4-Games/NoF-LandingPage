import connectToDatabase from '../../utils/db'

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase()
    const usersCollection = db.collection('users')

    // Find all users in the collection
    const users = await usersCollection.find({}).toArray()

    // Iterate through each user and set their "characters" and "medals" arrays to empty arrays
    for (const user of users) {
      await usersCollection.updateOne({ _id: user._id }, { $set: { characters: [], medals: [] } })
    }

    return res.status(200).json({
      message: 'Characters and medals arrays cleared for all users.'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: 'An error occurred while processing your request.'
    })
  }
}
