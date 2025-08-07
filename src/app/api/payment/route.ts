// src/app/api/payment/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()
  
  // In a real implementation, you would integrate with SSLCommerz here
  // This is just a mock implementation
  
  try {
    // Simulate payment processing
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
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Payment processing error'
    }, { status: 500 })
  }
}