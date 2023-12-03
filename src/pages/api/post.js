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

  // Verificar si el usuario tiene los personajes del 122 al 133 en su inventario
  const charactersToCheck = Array.from({ length: 12 }, (_, i) => i + 122)

  try {
    const db = await connectToDatabase() // Conexión a la base de datos
    const usersCollection = db.collection('users')
    const charactersCollection = db.collection('characters')
    const user = await findUserByDiscordID(db, discordID)

    if (user) {
      const characters = user.characters

      // Encontrar los personajes que faltan en el inventario del usuario
      const missingCharacters = charactersToCheck.filter(
        (characterID) => !characters.some((character) => character.id === characterID)
      )

      if (missingCharacters.length > 0) {
        // Seleccionar un personaje aleatorio entre los faltantes
        const randomCharacterID =
          missingCharacters[Math.floor(Math.random() * missingCharacters.length)]

        // Obtener los datos del personaje aleatorio
        const missingCharacterData = await charactersCollection.findOne({
          id: randomCharacterID
        })

        if (missingCharacterData) {
          // Agregar el personaje faltante al array de characters del usuario
          characters.push(missingCharacterData)

          // Actualizar la base de datos con el nuevo personaje
          await usersCollection.updateOne({ discordID }, { $set: { characters } })

          const response = await axios.get(`${storageUrlGamma}/T2/${randomCharacterID}.png`, {
            responseType: 'arraybuffer'
          })

          res.setHeader('Content-Type', 'image/png')
          res.status(200).send(response.data)
        } else {
          res.status(404).json({
            error: 'Failed to retrieve missing character data.'
          })
        }
      } else {
        res.status(200).json({
          message: 'User already has all the characters in the range.'
        })
      }
    } else {
      res.status(404).json({ message: 'User not found.' })
    }
  } catch (error) {
    console.error('Error while processing the request:', error)
    res.status(500).json({
      error: 'Error while processing the request.'
    })
  }
}
