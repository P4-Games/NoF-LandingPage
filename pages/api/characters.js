import axios from 'axios';

export default async function handler(req, res) {
  const { discordID } = req.query;

  try {
    // Realiza una solicitud GET para obtener los datos del archivo JSON
    const response = await axios.get('https://api.jsonbin.io/v3/b/645e3e318e4aa6225e9b9ed0/latest', {
      headers: {
        'X-Master-Key': '$2b$10$F0trbhCY6YrpjDlyC3lilu8xwycimMfmenE.ak1eC5nhHrXX/g5B6'
      }
    });
    const usersData = response.data.record;

    // Busca el usuario con el discordID correspondiente en el archivo JSON de usuarios
    const user = usersData.users.find(user => user.discordID === discordID);

    if (!user) {
      // Si no se encuentra ningún usuario con el discordID especificado, devuelve un arreglo vacío
      res.status(200).json([]);
    } else {
      // Si se encuentra el usuario, devuelve un arreglo con las URLs de imagen de sus personajes
      const characterImages = user.characters.map(character => character.image);
      res.status(200).json(characterImages);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Ha ocurrido un error al obtener los datos del archivo JSON');
  }
}

