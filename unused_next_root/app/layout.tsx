import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/chatbot/Chatbot'

export const metadata: Metadata = {
  title: 'PickMyTech - Your Intelligent Device Recommendation Platform',
  description: 'Discover the perfect mobile, laptop, or gadget that matches your needs, budget, and preferences. Powered by AI-driven recommendations.',
  keywords: 'mobile phones, laptops, device recommendations, tech buying guide, gadget reviews',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Chatbot />
        </Providers>
      </body>
    </html>
  )
}

