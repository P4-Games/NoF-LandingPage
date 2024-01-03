export const handleError = async (wallet, operation, errorMsg) => {
  try {
    console.error({ errorMsg })

    const data = {}
    data.wallet = wallet
    data.operation = operation
    data.message = errorMsg.toString()

    const res = await fetch('/api/mail/e', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    await res.json()
  } catch (ex) {
    console.log('error en _handleError', ex)
  }
}
