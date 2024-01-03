import nodeMailer from 'nodemailer'
import sgMail from '@sendgrid/mail'
import { MAIL_CONFIG, MAIL_CLIENT } from '../../../config'

async function sendWithEthereal(subject, textContent, htmlContent, mailTo) {
  try {
    const transporter = nodeMailer.createTransport({
      host: MAIL_CONFIG.ethereal_host,
      port: MAIL_CONFIG.ethereal_port,
      auth: {
        user: MAIL_CONFIG.ethereal_user,
        pass: MAIL_CONFIG.ethereal_pswd
      }
    })
    const mailOptions = {
      from: MAIL_CONFIG.from,
      to: mailTo,
      subject: subject,
      text: textContent,
      html: htmlContent
    }

    console.log(mailOptions)

    return transporter
      .sendMail(mailOptions)
      .then(() => {
        console.info('Email sent')
        return true
      })
      .catch((e) => {
        console.error('mail error: ' + e.message)
        return false
      })
  } catch (e) {
    console.error('mail error: ' + e.message)
    return false
  }
}

async function sendWithSendGrid(subject, textContent, htmlContent, mailTo) {
  try {
    const data = {
      from: MAIL_CONFIG.sg_from,
      to: mailTo,
      subject: subject,
      text: textContent,
      html: htmlContent
    }
    sgMail.setApiKey(MAIL_CONFIG.sg_key)
    return sgMail
      .send(data)
      .then(() => {
        console.info('Email sent')
        return true
      })
      .catch((e) => {
        console.error('mail error: ' + e.message)
        return false
      })
  } catch (e) {
    console.error('mail error: ' + e.message)
    return false
  }
}

/**
 * Obtención del template de html para los correos
 * Si se envía con sendGrid, tener en cuenta que puede hacer reemplazo de los href, si está activo
 * el "click tracking", ver más información en:
 * https://sendgrid.com/docs/ui/analytics-and-reporting/click-tracking-html-best-practices/
 * @param {*} content
 */
function getHtmlTemplate(content) {
  const urlContact = 'https://nof.town/'
  const urlNOF = 'https://nof.town/'
  const urlLogo = 'https://nof.town/images/hero/oro.png'

  const today = new Date()
  const year = today.getFullYear()

  return `<br/><br/><br/><img style='display:block;margin-left:auto;margin-right:auto;background:#3D5A73' alt='nof' src="${urlLogo}" height='100'></img><br/><div style='background: #679DDB; border-left: 2px solid #3D5A73;'>${content}</div><br/><p style='font-size:12px'>Ante cualquier consulta, <a target="_blank" href="${urlContact}" rel="noopener noreferrer">contactate</a> con nosotros.</p><p style='font-size:12px'><a target="_blank" href="${urlNOF}" rel="noopener noreferrer">NoF</a> Ⓒ ${year}</p>
  `
}

export async function sendMail(subject, textContent, htmlContent, mailTo) {
  var result = false

  try {
    switch (MAIL_CONFIG.client) {
      case MAIL_CLIENT.sendgrid:
        result = await sendWithSendGrid(subject, textContent, getHtmlTemplate(htmlContent), mailTo)
        break
      case MAIL_CLIENT.ethereal:
        result = await sendWithEthereal(subject, textContent, getHtmlTemplate(htmlContent), mailTo)
        break
      default:
        result = await sendWithSendGrid(subject, textContent, getHtmlTemplate(htmlContent), mailTo)
        break
    }
    return result
  } catch (e) {
    console.error('mail error: ' + e.message)
    return false
  }
}
