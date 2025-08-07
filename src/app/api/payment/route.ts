// src/app/api/payment/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock payment success in 90% of cases
    const success = Math.random() > 0.1

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Payment successful',
        transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment failed - insufficient funds'
      }, { status: 400 })
    }
  } catch {
    return NextResponse.json({
      success: false,
      message: 'Payment processing error'
    }, { status: 500 })
  }
}
