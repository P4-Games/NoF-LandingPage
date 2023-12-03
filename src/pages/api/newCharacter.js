import connectToDatabase from '../../utils/db'
import { storageUrlGamma } from '../../config'

const getRandomCharacterID = async (db, channelId) => {
  const serversCollection = db.collection('servers')
  const server = await serversCollection.findOne({
    channelId
  })

  if (!server) {
    throw new Error(`Server not found for channelId: ${channelId}`)
  }

  const characterID = server.nofy

  if (characterID === null) {
    return null // Personaje ya fue reclamado
  } else if (characterID === 0) {
    return 0 // Número aleatorio no encontrado
  }

  return characterID
}

const findUserByDiscordID = async (db, discordID) => {
  const collection = db.collection('users')
  const user = await collection.findOne({
    discordID
  })

  if (!user) {
    throw new Error(
      `User with Discord ID: ${discordID} not found. If you haven't registered yet, please use the command **/start** to begin playing.`
    )
  }

  return user
}

const findCharacterByID = async (db, characterID) => {
  const characterImage = `${storageUrlGamma}/T2/${characterID}.png`
  const charactersCollection = db.collection('characters')
  const character = await charactersCollection.findOne({
    image: characterImage
  })

  if (!character) {
    throw new Error(`Character not found or missing image for characterID: ${characterID}`)
  }

  return { id: characterID, image: characterImage }
}

const addCharacterToInventory = async (db, userID, characterID, characterImage) => {
  const userCollection = db.collection('users')

  await userCollection.updateOne(
    { _id: userID },
    {
      $addToSet: {
        characters: {
          id: characterID,
          image: characterImage
        }
      }
    }
  )
}

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { discordID, channelID } = req.body

    const db = await connectToDatabase()
    const user = await findUserByDiscordID(db, discordID)

    if (!user) {
      return res.status(200).json({
        message: `User with Discord ID: ${discordID} not found. If you haven't registered yet, please use the command **/start** to begin playing.`
      })
    }

    const characterID = await getRandomCharacterID(db, channelID)

    if (characterID === null) {
      return res.status(200).json({
        message: 'The character has already been collected.'
      })
    }

    const character = user.characters.find((c) => c.id.toString() === characterID.toString())

    if (character) {
      return res.status(200).json({
        message: 'You already have this character in your inventory.'
      })
    }

    const characterObj = await findCharacterByID(db, characterID)
    await addCharacterToInventory(db, user._id, characterObj.id, characterObj.image)

    const serversCollection = db.collection('servers')
    await serversCollection.updateOne({ channelId: channelID }, { $set: { nofy: null } })

    res.status(200).json({
      message: 'Character added successfully.',
      image: characterObj.image
    })
  } catch (error) {
    console.error(error)

    if (error.message.includes('User with Discord ID:')) {
      res.status(200).json({ message: error.message })
    } else {
      res.status(200).json({ message: 'Server error' })
    }
  }
}
