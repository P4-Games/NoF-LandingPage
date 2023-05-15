import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

import connectToDatabase from '../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Request method not allowed: ', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { nick, discordID } = req.body;

    const db = await connectToDatabase();
    const collection = db.collection('users');

    // Buscar el usuario correspondiente al discordID
    console.log('Buscando usuario con discordID: ', discordID);
    const existingUser = await collection.findOne({ discordID });

    if (existingUser) {
      console.log('El usuario ya está registrado');
      const updatedUser = {
        ...existingUser,
        nick: nick || existingUser.nick,
        discordID: discordID || existingUser.discordID,
      };
      const result = await collection.updateOne(
        { _id: existingUser._id },
        { $set: updatedUser }
      );
      console.log('Usuario actualizado con éxito');
      return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    }

    // Crear un nuevo usuario
    console.log('Creando un nuevo usuario');
    const newUser = { nick, discordID, characters: [] };
    const result = await collection.insertOne(newUser);

    console.log('Usuario creado con éxito');
    res.status(201).json({ message: 'User created successfully', id: result.insertedId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
