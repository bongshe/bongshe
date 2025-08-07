import crypto from 'crypto'
import twilio from 'twilio'
import nodemailer from 'nodemailer'
import { verificationEmailTemplate } from './email-templates'

export function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString()
}

// ✅ SEND WHATSAPP CODE
export async function sendWhatsappVerification(phone: string, code: string) {
  const formattedPhone = phone.replace(/\D/g, '')
  const whatsappNumber = formattedPhone.startsWith('+')
    ? `whatsapp:${formattedPhone}`
    : `whatsapp:+${formattedPhone}`

  try {
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    )

    await twilioClient.messages.create({
      body: `Your verification code is: ${code}`,
      from: 'whatsapp:+14155238886', // Twilio sandbox
      to: whatsappNumber,
    })

    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown WhatsApp error'
    console.error('WhatsApp sending failed:', message)
    return { success: false, error: message }
  }
}

// ✅ SEND EMAIL CODE
export async function sendVerificationEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Your Site Name" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify Your Email',
    html: verificationEmailTemplate(code),
  })
}
