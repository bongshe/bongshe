// src/app/layout.tsx

import './globals.css'
import type { Metadata } from 'next/types'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'


export const metadata: Metadata = {
  title: 'E-Commerce Store',
  description: 'Your one-stop shop for everything',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}
