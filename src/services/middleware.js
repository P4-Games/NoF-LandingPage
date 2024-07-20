const cache = new Map()

export const fetchWithRetry = async (key, requestFunc, retries = 5, delay = 2000) => {
  // Verifica si el resultado ya está en caché
  if (cache.has(key)) {
    console.log('get from cache: ', key)
    return cache.get(key)
  }

  console.log('NO from cache: ', key)
  for (let i = 0; i < retries; i++) {
    try {
      const result = await requestFunc()
      // Guarda el resultado en caché
      cache.set(key, result)
      console.log('save in cache:', key, result)
      return result
    } catch (error) {
      console.log('retry: ', key, i + 1)
      if (error.code === -32005 && i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        throw error
      }
    }
  }
}
