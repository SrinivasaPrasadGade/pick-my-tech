'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Settings, LogOut, Award } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{session.user?.name || 'User'}</h1>
            <p className="text-gray-600 dark:text-gray-400">{session.user?.email}</p>
          </div>

          <div className="space-y-4">
            <Link
              href="/recommendations"
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="font-semibold">My Recommendations</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">View personalized device recommendations</div>
              </div>
            </Link>

            <Link
              href="/quiz"
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="font-semibold">Update Preferences</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Retake the quiz to update your preferences</div>
              </div>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center space-x-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-600 dark:text-red-400"
            >
              <LogOut className="w-6 h-6" />
              <span className="font-semibold">Sign Out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

