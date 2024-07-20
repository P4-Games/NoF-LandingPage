/* eslint-disable no-await-in-loop */
const cache = new Map()

export const fetchWithRetry = async (key, requestFunc, retries = 5, delay = 2000) => {
  if (cache.has(key)) {
    return cache.get(key)
  }

  for (let i = 0; i < retries; i++) {
    try {
      const result = await requestFunc()
      cache.set(key, result)
      return result
    } catch (error) {
      console.info('fetchWithRetry-retry: ', key, i + 1)
      if (error.code === -32005 && i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        throw error
      }
    }
  }
}
