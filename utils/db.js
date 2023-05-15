const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://nofnofnof:nofnofnof@nof.f14znpg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    return client.db("nombre_de_tu_base_de_datos");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectToDatabase;
