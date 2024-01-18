import { MAIL_CONFIG } from '../../../config'
import { sendMail } from './common'

export default async function handler(req, res) {
  const data = req.body

  if (!data || !Object.keys(data).length || !data.message) {
    res.status(400).end(JSON.stringify({ message: 'invalid data in request' }))
    return
  }

  const subject = `👋 Mensaje del sitio web de ${data.wallet}`

  const textContent = `
    Mensaje del sitio web:
      ${data.operation || ''}
      ${data.message || ''}
    Datos de contacto:
      - wallet: ${data.wallet || '0x'}`

  const htmlContent = `
      <div style='text-align: left; font-size:18px;font-family:GothamBook;padding: 40px'>
        <p><b>Mensaje del sitio web:</b></p>
          <ul>
            <li><b>Wallet:</b> ${data.wallet || '0x'}</li>
            <li><b>Opertion:</b> ${data.operation || ''}</li>
            <li><b>Message:</b> ${data.message || ''}</li>
          </ul>
      </div>
    `

  const resultSent = await sendMail(subject, textContent, htmlContent, MAIL_CONFIG.to)

  if (resultSent) {
    res.status(200).end(JSON.stringify({ message: 'ok' }))
  } else {
    res.status(400).end(JSON.stringify({ message: 'sent error' }))
  }
}
