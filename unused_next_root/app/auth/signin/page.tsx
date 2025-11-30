'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Github, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl)
      }
    })
  }, [router, callbackUrl])

  const handleSignIn = async (provider: string) => {
    setLoading(true)
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      console.error('Sign in error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome to <span className="gradient-text">PickMyTech</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to get personalized recommendations
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleSignIn('google')}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full font-semibold hover:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleSignIn('github')}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-900 dark:bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </motion.div>
    </div>
  )
}

