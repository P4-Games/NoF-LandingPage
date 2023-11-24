import connectToDatabase from '../../utils/db'

// Función para obtener el ranking de los usuarios
const getUsersRank = async () => {
  // Conectar a la base de datos
  const db = await connectToDatabase()
  const usersCollection = db.collection('users')

  // Obtener todos los usuarios
  const userRanking = await usersCollection.find().toArray()

  // Ordenar los usuarios por rango de medallas y número de personajes
  const sortedRanking = userRanking.sort((a, b) => {
    // Calcular el rango de medallas para cada usuario
    const aMedalRank = calculateMedalRank(a.medals)
    const bMedalRank = calculateMedalRank(b.medals)

    // Comparar el rango de medallas de los usuarios
    if (aMedalRank > bMedalRank) {
      return -1
    } else if (aMedalRank < bMedalRank) {
      return 1
    } else {
      // Si los usuarios tienen el mismo rango de medallas, comparar por cantidad de personajes
      if (a.characters.length > b.characters.length) {
        return -1
      } else if (a.characters.length < b.characters.length) {
        return 1
      } else {
        return 0 // Los usuarios son iguales en rango de medallas y cantidad de personajes
      }
    }
  })

  // Limitar el ranking a los primeros 10 jugadores
  const limitedRanking = sortedRanking.slice(0, 10)

  // Crear la lista de ranking con la posición, el nombre, la cantidad de personajes y las medallas
  const rankingList = limitedRanking.map((user, index) => ({
    Position: index + 1,
    Nick: user.nick,
    Characters: user.characters.length,
    Medals: user.medals
  }))

  return rankingList
}

// Función para calcular el rango de medallas de un usuario
const calculateMedalRank = (medals) => {
  let medalRank = 0

  // Sumar los rangos de todas las medallas del usuario
  medalRank += countMedals(medals, 'gold') * 3 // Cada medalla de oro vale 3 puntos
  medalRank += countMedals(medals, 'silver') * 2 // Cada medalla de plata vale 2 puntos
  medalRank += countMedals(medals, 'bronze') * 1 // Cada medalla de bronce vale 1 punto

  return medalRank
}

// Función para contar la cantidad de un tipo de medalla específico
const countMedals = (medals, medalType) => medals.filter((medal) => medal === medalType).length

// Controlador de la API
export default async function handler(req, res) {
  // Solo permitir el método GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Obtener el ranking de los usuarios
    const usersRank = await getUsersRank()

    // Enviar el ranking de los usuarios como respuesta
    res.status(200).json(usersRank)
  } catch (error) {
    // Manejar los errores
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
