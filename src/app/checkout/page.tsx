// src/app/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import CheckoutForm from './CheckoutForm'
import PaymentForm from './PaymentForm'
import OrderConfirmation from './OrderConfirmation'
import { createOrder } from '@/app/actions/order'
import { redirect } from 'next/navigation'
import CheckoutAuth from './CheckoutAuth'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const { cartItems, cartTotal, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [contactInfo, setContactInfo] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContactSubmit = async (data) => {
    setContactInfo(data)
    
    if (session) {
      setStep(2)
    } else {
      setStep(1.5) // Show login/signup step
    }
  }

  const handleLoginSuccess = () => {
    setStep(2)
  }

  const handlePaymentSubmit = async (paymentMethod) => {
    setLoading(true)
    setError('')
    
    try {
      // Create order in database
      const orderData = {
        userId: session?.user?.id,
        totalAmount: cartTotal,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price
        })),
        ...contactInfo
      }
      
      const newOrder = await createOrder(orderData)
      setOrderId(newOrder.id)
      
      // Process payment with SSLCommerz
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: newOrder.id,
          amount: cartTotal,
          customerInfo: {
            ...contactInfo,
            userId: session?.user?.id
          },
          paymentMethod
        })
      })
      
      const paymentData = await paymentResponse.json()
      
      if (paymentData.success) {
        clearCart()
        setStep(3)
      } else {
        setError(paymentData.message || 'Payment failed')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Failed to complete checkout')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0 && step !== 3) {
    redirect('/cart')
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between mb-8">
        <div className={`text-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
          <div className="w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center mb-2">
            {step > 1 ? '✓' : '1'}
          </div>
          <span>Contact Info</span>
        </div>
        
        <div className={`text-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
          <div className="w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center mb-2">
            {step > 2 ? '✓' : '2'}
          </div>
          <span>Payment</span>
        </div>
        
        <div className={`text-center ${step === 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
          <div className="w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center mb-2">
            3
          </div>
          <span>Confirmation</span>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {step === 1 && (
        <CheckoutForm 
          onSubmit={handleContactSubmit} 
          initialData={contactInfo}
        />
      )}
      
      {step === 1.5 && (
        <CheckoutAuth 
          contactInfo={contactInfo} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {step === 2 && (
        <PaymentForm 
          onSubmit={handlePaymentSubmit} 
          loading={loading}
        />
      )}
      
      {step === 3 && orderId && (
        <OrderConfirmation orderId={orderId} />
      )}
    </div>
  )
}