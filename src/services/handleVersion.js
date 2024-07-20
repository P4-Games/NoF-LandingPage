export const getProductVersion = async () => {
  try {
    const res = await fetch('/api/version/v', {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
    const result = await res.json()
    return result.version
  } catch (ex) {
    console.log('error en getProductVersion', ex)
    return '1.0.0'
  }
}
