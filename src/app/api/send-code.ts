// src/app/api/send-code.ts

import { NextRequest, NextResponse } from 'next/server'
import { generateVerificationCode, sendWhatsappVerification  } from '@/app/lib/verification'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { phone } = body

  if (!phone) {
    return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 })
  }

  const code = generateVerificationCode()
  const result = await sendWhatsappVerification(phone, code)

  if (result.success) {
    return NextResponse.json({ success: true, code })
  } else {
    return NextResponse.json(
      { success: false, error: result.error || 'Failed to send SMS' },
      { status: 500 }
    )
  }
}
