const { v4: uuidv4 } = require("uuid");
const connectToDatabase = require("./utils/db");
const Jimp = require("jimp");
const fs = require("fs");

async function resizeAndSaveImages(req, res) {
  try {
    const db = await connectToDatabase();
    const charactersCollection = db.collection("characters");

    // Obtener todas las imágenes de la colección "characters"
    const characters = await charactersCollection.find({}).toArray();
    const characterImages = characters.map((c) => c.image);

    // Crear la carpeta "characters" si no existe
    const directory = "./characters";
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    // Recorrer y redimensionar las imágenes
    for (let i = 0; i < characterImages.length; i++) {
      const imageUrl = characterImages[i];
      const image = await Jimp.read(imageUrl);
      image.resize(80, 80);

      // Obtener el nombre de archivo de la imagen
      const filename = `${i}.png`;

      // Guardar la imagen redimensionada en la carpeta "characters"
      await image.writeAsync(`${directory}/${filename}`);
    }

    return res.status(200).json({ message: "Images resized and saved successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
}

resizeAndSaveImages();
