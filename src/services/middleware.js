const cache = new Map()

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchWithRetry = async (key, requestFunc, retries = 5, delay = 2000) => {
  // Verifica si el resultado ya está en caché
  if (cache.has(key)) {
    console.log('get from cache: ', key)
    return cache.get(key)
  }

  console.log('NO from cache: ', key)

  // Crear un array de intentos
  const attempts = Array.from({ length: retries }, (_, index) => index)

  // Manejar reintentos secuenciales usando reduce
  const resultRetries = await attempts.reduce(async (prevPromise, attempt) => {
    try {
      // Espera el resultado de requestFunc
      const resolvedValue = await prevPromise
      const resultRequestFunc = await requestFunc()

      // Guarda el resultado en caché
      cache.set(key, resultRequestFunc)
      console.log('save in cache:', key, resultRequestFunc)
      return resultRequestFunc
    } catch (error) {
      console.log('retry: ', key, attempt + 1)

      if (error.code === -32005 && attempt < retries - 1) {
        // Solo esperar entre reintentos si aún no se han agotado todos los intentos
        await sleep(delay)
        return prevPromise
      }
      // Si el error no es recuperable o hemos agotado los intentos, lanzar el error
      throw error
    }
  }, Promise.reject()) // Iniciar con una promesa rechazada

  return resultRetries
}
