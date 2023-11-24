import connectToDatabase from '../../utils/db'

// Función para actualizar la URL de la imagen de los personajes en la colección
const updateCharacterImages = async (db) => {
  const charactersCollection = db.collection('characters')

  // Obtener todos los personajes de la colección
  const characters = await charactersCollection.find({}).toArray()

  // Recorrer cada personaje y actualizar la URL de la imagen
  for (const character of characters) {
    // Obtener la URL de la imagen actual del personaje
    const currentImage = character.image

    // Verificar si la URL de la imagen no es undefined antes de intentar reemplazar 'T1' por 'T2'
    if (currentImage) {
      // Reemplazar 'T1' por 'T2' en la URL de la imagen
      const updatedImage = currentImage.replace('T1', 'T2')

      // Actualizar el personaje con la nueva URL de la imagen en la base de datos
      await charactersCollection.updateOne(
        { _id: character._id },
        { $set: { image: updatedImage } }
      )
    }
  }

  // Obtener la información actualizada de todos los personajes
  const updatedCharacters = await charactersCollection.find({}).toArray()

  return updatedCharacters
}

// Manejador de la API para actualizar las URLs de las imágenes de los personajes
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const db = await connectToDatabase()

    // Actualizar las URLs de las imágenes de los personajes y obtener la información actualizada de todos los personajes
    const updatedCharacters = await updateCharacterImages(db)

    // Devolver la información actualizada de todos los personajes
    res.status(200).json({ characters: updatedCharacters })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
