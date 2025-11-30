'use client'

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          There was an error signing you in. Please try again.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}

