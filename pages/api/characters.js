import connectToDatabase from '../../utils/db';
import Jimp from 'jimp';

export default async function handler(req, res) {
  const { query: { discordID } } = req;

  if (!discordID) {
    return res.status(400).json({ error: "Discord ID is missing from query parameters." });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const charactersCollection = db.collection("characters");

    // Buscar el usuario por su discordID
    const user = await usersCollection.findOne({ discordID });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Obtener los personajes del usuario y sus imágenes
    const characters = await charactersCollection.find({ id: { $in: user.characters.map((c) => c.id) } }).toArray();
    const characterImages = characters.map((c) => c.image);

    // Cargar las imágenes
    const images = await Promise.all(characterImages.map((imageUrl) => Jimp.read(imageUrl)));

    // Calcular el tamaño del lienzo del collage
    const maxImagesPerRow = 4;
    const maxImagesPerColumn = Math.ceil(images.length / maxImagesPerRow);
    const imageWidth = images[0].bitmap.width;
    const imageHeight = images[0].bitmap.height;

    const collageWidth = maxImagesPerRow * imageWidth;
    const collageHeight = maxImagesPerColumn * imageHeight;

    // Crear un lienzo para el collage
    const collage = new Jimp(collageWidth, collageHeight);

    // Colocar las imágenes en el collage
    let currentX = 0;
    let currentY = 0;

    for (let i = 0; i < images.length; i++) {
      collage.composite(images[i], currentX, currentY);

      // Actualizar las coordenadas para la siguiente imagen
      currentX += imageWidth;
      if (currentX >= collageWidth) {
        currentX = 0;
        currentY += imageHeight;
      }
    }

    // Obtener la imagen del collage como un buffer
    const collageBuffer = await collage.getBufferAsync(Jimp.MIME_PNG);

    // Establecer el encabezado Content-Type
    res.setHeader('Content-Type', 'image/png');

    // Enviar la imagen como respuesta
    return res.status(200).send(collageBuffer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
}
