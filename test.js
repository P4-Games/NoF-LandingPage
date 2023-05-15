const fs = require("fs");
const connectToDatabase = require("./utils/db");

const insertCharacters = async (db, characters) => {
  const charactersCollection = db.collection("characters");

  // Inserta cada personaje individualmente
  for (const character of characters) {
    try {
      await charactersCollection.insertOne(character);
      console.log(`Personaje ${character.name} insertado correctamente.`);
    } catch (error) {
      console.log(`Error insertando el personaje ${character.name}: ${error}`);
    }
  }

  console.log(`Todos los personajes han sido insertados correctamente.`);
};

const main = async () => {
  try {
    const data = fs.readFileSync("./characters.json", "utf8");
    const characters = JSON.parse(data);

    const db = await connectToDatabase();
    await insertCharacters(db, characters);
    db.close();
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

main();
