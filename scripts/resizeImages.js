const Jimp = require('jimp')
const fs = require('fs')

async function resizeAndSaveImages() {
  try {
    const basePath = './characters'
    // Read the list of image filenames from the "/characters/T2" folder
    const imageFilenames = fs.readdirSync(`${basePath}/T2`)

    // Recorrer y redimensionar las imágenes
    for (let i = 0; i < imageFilenames.length; i++) {
      const imageUrl = `${basePath}/T2/${imageFilenames[i]}`
      const image = await Jimp.read(imageUrl)
      image.resize(80, 80)

      // Obtener el nombre de archivo de la imagen (usando el mismo nombre de entrada)
      const filename = imageFilenames[i]

      // Guardar la imagen redimensionada en la carpeta "characters"
      await image.writeAsync(`${basePath}/T2/${filename}`)
    }

    console.log('Images resized and saved successfully.')
  } catch (error) {
    console.log(error)
    console.log('An error occurred while processing the images.')
  }
}

resizeAndSaveImages()
