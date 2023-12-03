import connectToDatabase from '../../utils/db'
import { storageUrlGamma } from '../../config'
import axios from 'axios'

const findUserByDiscordID = async (db, discordID) => {
  const collection = db.collection('users')
  const user = await collection.findOne({
    discordID
  })
  return user
}

export default async function handler(req, res) {
  const { discordID } = req.query
  const topGGToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMDgzNzg0NjI4MjczMjM0NTMiLCJib3QiOnRydWUsImlhdCI6MTY4NzUyMDU4Nn0.PJ4gm55wh-VB5V-9Mh2cWfIden2DAL5qsM6NH-XfE70'
  const botID = '1108378462827323453'

  try {
    const response = await axios.get(`https://top.gg/api/bots/${botID}/check`, {
      headers: {
        Authorization: topGGToken
      },
      params: {
        userId: discordID
      }
    })

    const voted = response.data.voted

    if (voted) {
      // Consultar la base de datos para obtener los personajes del usuario
      const db = await connectToDatabase() // Conexión a la base de datos
      const usersCollection = db.collection('users')
      const charactersCollection = db.collection('characters')
      const user = await findUserByDiscordID(db, discordID)

      if (user) {
        const characters = user.characters

        // Encontrar el primer personaje que falte en la lista del usuario
        let missingCharacter = null
        for (let i = 0; i <= 119; i++) {
          const foundCharacter = characters.find((character) => character.id === i)
          if (!foundCharacter) {
            missingCharacter = i
            break
          }
        }

        if (missingCharacter !== null) {
          // Agregar el personaje faltante al array de characters del usuario
          const missingCharacterData = await charactersCollection.findOne({
            id: missingCharacter
          })
          if (missingCharacterData) {
            characters.push(missingCharacterData)
          }

          // Actualizar la base de datos con el nuevo personaje
          await usersCollection.updateOne({ discordID }, { $set: { characters } })

          const imageUrl = `${storageUrlGamma}/T2/${missingCharacter}.png`
          res.status(200).json({
            voted: true,
            missingCharacter,
            imageUrl
          })
        } else {
          res.status(200).json({
            voted: true,
            message: 'Your inventory is full.'
          })
        }
      } else {
        res.status(200).json({
          voted: true,
          message: 'User not found.'
        })
      }
    } else {
      res.status(200).json({ voted: false })
    }
  } catch (error) {
    console.error('Error while checking the voting status:', error)
    res.status(500).json({
      error: 'Error while checking the voting status.'
    })
  }
}
