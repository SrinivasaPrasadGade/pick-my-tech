'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X, Search, User } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold gradient-text">PickMyTech</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/devices" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              Browse Devices
            </Link>
            <Link href="/news" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              Tech News
            </Link>
            <Link href="/community" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
              Community
            </Link>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>

            {/* Auth Buttons */}
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{session.user?.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-4">
              <Link href="/" className="block text-gray-700 dark:text-gray-300">Home</Link>
              <Link href="/devices" className="block text-gray-700 dark:text-gray-300">Browse Devices</Link>
              <Link href="/news" className="block text-gray-700 dark:text-gray-300">Tech News</Link>
              <Link href="/community" className="block text-gray-700 dark:text-gray-300">Community</Link>
              {session ? (
                <>
                  <Link href="/profile" className="block text-gray-700 dark:text-gray-300">Profile</Link>
                  <button onClick={() => signOut()} className="block w-full text-left text-gray-700 dark:text-gray-300">
                    Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => signIn()} className="block w-full text-left text-gray-700 dark:text-gray-300">
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

