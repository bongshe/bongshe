// src/app/checkout/PaymentForm.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function PaymentForm({ onSubmit, loading }) {
  const { data: session } = useSession()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [savedCards, setSavedCards] = useState([
    { id: 'card1', last4: '4242', brand: 'Visa' }
  ])
  const [selectedCard, setSelectedCard] = useState('card1')
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    let paymentData
    if (paymentMethod === 'card') {
      if (selectedCard === 'new') {
        paymentData = {
          method: 'card',
          type: 'new',
          details: newCard
        }
      } else {
        const card = savedCards.find(c => c.id === selectedCard)
        paymentData = {
          method: 'card',
          type: 'saved',
          cardId: card.id
        }
      }
    } else {
      paymentData = { method: paymentMethod }
    }
    
    onSubmit(paymentData)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Select Payment Method</label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="mr-3"
              />
              <label htmlFor="card" className="flex items-center">
                <span>Credit/Debit Card</span>
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="mobile"
                name="paymentMethod"
                value="mobile"
                checked={paymentMethod === 'mobile'}
                onChange={() => setPaymentMethod('mobile')}
                className="mr-3"
              />
              <label htmlFor="mobile" className="flex items-center">
                <span>Mobile Banking</span>
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="mr-3"
              />
              <label htmlFor="cash" className="flex items-center">
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>
        
        {paymentMethod === 'card' && (
          <div className="mb-6 border-t pt-6">
            {session && savedCards.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Saved Cards</label>
                <div className="space-y-3">
                  {savedCards.map(card => (
                    <div key={card.id} className="flex items-center">
                      <input
                        type="radio"
                        id={card.id}
                        name="savedCard"
                        checked={selectedCard === card.id}
                        onChange={() => setSelectedCard(card.id)}
                        className="mr-3"
                      />
                      <label htmlFor={card.id} className="flex items-center">
                        <span className="mr-2">•••• •••• •••• {card.last4}</span>
                        <span className="text-sm text-gray-500">({card.brand})</span>
                      </label>
                    </div>
                  ))}
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="newCard"
                      name="savedCard"
                      checked={selectedCard === 'new'}
                      onChange={() => setSelectedCard('new')}
                      className="mr-3"
                    />
                    <label htmlFor="newCard">Use a new card</label>
                  </div>
                </div>
              </div>
            )}
            
            {selectedCard === 'new' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Card Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCard.number}
                    onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                    placeholder="MM/YY"
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    CVC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCard.cvc}
                    onChange={(e) => setNewCard({...newCard, cvc: e.target.value})}
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Name on Card <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCard.name}
                    onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                    placeholder="Full name"
                    className="w-full p-3 border border-gray-300 rounded"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-70"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  )
}