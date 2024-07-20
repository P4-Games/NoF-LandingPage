const { MongoClient, ServerApiVersion } = require('mongodb')

const uri = process.env.MONGODB

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connectToDatabase() {
  try {
    await client.connect()
    console.info('Connected to MongoDB successfully!')
    return client.db('nombre_de_tu_base_de_datos')
  } catch (error) {
    console.error(error)
  }
}

module.exports = connectToDatabase
