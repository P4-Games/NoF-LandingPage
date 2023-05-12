import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { discordID, characterID } = req.body;

    // Obtener los usuarios desde jsonbin.io
    const response = await fetch('https://api.jsonbin.io/v3/b/645e3e318e4aa6225e9b9ed0/latest', {
      headers: {
        'X-Master-Key': "$2b$10$F0trbhCY6YrpjDlyC3lilu8xwycimMfmenE.ak1eC5nhHrXX/g5B6"
      }
    });

    const { record: users } = await response.json();

    // Buscar el usuario correspondiente al discordID
    const user = users.find(u => u.discordID === discordID);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Verificar si el personaje ya está en el inventario del usuario
    const character = user.characters.find(c => c.id === characterID);

    if (character) {
      return res.status(400).json({ message: 'Ya tienes este personaje en tu inventario' });
    }

    // Obtener los personajes desde un archivo local
    const charactersPath = path.join(process.cwd(), 'characters.json');
    const charactersData = fs.readFileSync(charactersPath);
    const characters = JSON.parse(charactersData);

    // Buscar el personaje correspondiente al characterID
    const newCharacter = characters.find(c => c.id === characterID);

    if (!newCharacter) {
      return res.status(400).json({ message: 'Character not found' });
    }

    // Agregar el nuevo personaje al inventario del usuario
    user.characters.push({ id: newCharacter.id, image: newCharacter.image });

    // Actualizar los usuarios en jsonbin.io
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        res.status(200).json({ message: 'Personaje agregado correctamente' });
      }
    };
    req.open("PUT", "https://api.jsonbin.io/v3/b/645e3e318e4aa6225e9b9ed0", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", "$2b$10$F0trbhCY6YrpjDlyC3lilu8xwycimMfmenE.ak1eC5nhHrXX/g5B6");
    req.send(JSON.stringify({ record: users }));
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
