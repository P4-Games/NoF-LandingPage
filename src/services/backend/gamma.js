import { gammaServiceUrl } from '../../config'

export const fetchPackData = async (account, pack_number) => {
  console.log('gammaServiceUrl', gammaServiceUrl)
  // llamada a la api para que nos de la data a pasar en la llamada al contrato
  try {
    const body = {
      address: account, // user address
      packet_number: pack_number // numero de paquete que se esta abriendo
    }
    const response = await fetch(gammaServiceUrl, {
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
