import { v4 as uuidv4 } from 'uuid'
import connectToDatabase from '../../utils/db'
import { join } from 'path'
import Jimp from 'jimp'

export default async function handler(req, res) {
  const {
    query: { discordID }
  } = req

  if (!discordID) {
    return res.status(400).json({
      error: 'Discord ID is missing from query parameters.'
    })
  }

  try {
    const db = await connectToDatabase()
    const usersCollection = db.collection('users')
    const charactersCollection = db.collection('characters')

    // Buscar el usuario por su discordID
    const user = await usersCollection.findOne({
      discordID
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    // Obtener los personajes del usuario y sus imágenes
    const characters = await charactersCollection.find({}).toArray()

    // Obtener los personajes que aún no están en el inventario del usuario
    const charactersNotInInventory = characters.filter(
      (character) => !user.characters.some((userCharacter) => userCharacter.id === character.id)
    )

    // Obtener las rutas de las imágenes locales redimensionadas de los personajes no presentes en el inventario
    const characterImagePaths = charactersNotInInventory.map((c) =>
      join(process.cwd(), 'scripts', 'characters', `${c.id}.png`)
    )

    // Crear una matriz de promesas para cargar las imágenes
    const imagePromises = characterImagePaths.map(async (imagePath) => await Jimp.read(imagePath))

    const images = await Promise.all(imagePromises)

    // Calcular el tamaño del lienzo del collage
    const maxImagesPerRow = getNumberOfColumns(images.length)
    const maxImagesPerColumn = Math.ceil(images.length / maxImagesPerRow)
    const imageWidth = images[0].bitmap.width
    const imageHeight = images[0].bitmap.height

    const collageWidth = maxImagesPerRow * imageWidth
    const collageHeight = maxImagesPerColumn * imageHeight

    // Crear un lienzo para el collage
    const collage = new Jimp(collageWidth, collageHeight)

    // Colocar las imágenes en el collage
    let currentX = 0
    let currentY = 0

    for (let i = 0; i < images.length; i++) {
      if (images[i]) {
        collage.composite(images[i], currentX, currentY)

        // Actualizar las coordenadas para la siguiente imagen
        currentX += imageWidth
        if (currentX >= collageWidth) {
          currentX = 0
          currentY += imageHeight
        }
      }
    }

    // Obtener la imagen del collage como un buffer
    const collageBuffer = await collage.getBufferAsync(Jimp.MIME_PNG)

    // Generar una cadena de consulta única
    const query = uuidv4()

    // Agregar la cadena de consulta única a la URL de la imagen
    const imageUrlWithQuery = `https://nof.town/api/characters/${discordID}?query=${query}`

    // Establecer los encabezados Content-Type y Cache-Control adecuadamente
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.setHeader('Location', imageUrlWithQuery)

    // Enviar la imagen como respuesta
    return res.status(200).send(collageBuffer)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: 'An error occurred while processing your request.'
    })
  }
}

function getNumberOfColumns(imageCount) {
  if (imageCount <= 30) {
    return 6
  } else if (imageCount <= 60) {
    return 7
  } else if (imageCount <= 90) {
    return 8
  } else if (imageCount <= 120) {
    return 10
  } else {
    return 11
  }
}
