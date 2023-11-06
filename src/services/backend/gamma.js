const api_endpoint = 'https://gamma-microservice-7bteynlhua-uc.a.run.app/'

// llamada a la api para que nos de la data a pasar en la llamada al contrato
export const fetchPackData = async (account, pack_number) => {
  try {
    const body = {
      address: account, // address del usuario
      packet_number: pack_number // numero de paquete que se esta abriendo
    }

    const response = await fetch(api_endpoint, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    })
    const data = await response.json()
    return data
  } catch (e) {
    console.error({ e })
  }
}
