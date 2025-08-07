// src/app/api/verify-code/route.ts 

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email, code } = await req.json()

  if (!email || !code) {
    return NextResponse.json({ success: false, error: 'Missing fields' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' })
  }

  const record = await prisma.verificationCode.findUnique({ where: { userId: user.id } })
  if (!record || record.code !== code || record.expiresAt < new Date()) {
    return NextResponse.json({ success: false, error: 'Invalid or expired code' })
  }

  // Update user as verified
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true, // or whatsappVerified depending on logic
    },
  })

  // Delete used code
  await prisma.verificationCode.delete({ where: { userId: user.id } })

  return NextResponse.json({ success: true })
}
