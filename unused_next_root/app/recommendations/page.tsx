'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, ShoppingBag, ExternalLink, ArrowRight } from 'lucide-react'

interface Device {
  id: string
  name: string
  brand: string
  price: number
  rating: number
  reviewCount: number
  imageUrl?: string
  score?: number
}

export default function RecommendationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/recommendations')
      return
    }

    if (status === 'authenticated') {
      fetchRecommendations()
    }
  }, [status, router])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations')
      const data = await response.json()
      setRecommendations(data.recommendations || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your recommendations...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 mb-6"
          >
            <span className="font-medium">Personalized For You</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your <span className="gradient-text">Recommendations</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Based on your preferences and requirements, here are the devices we recommend for you
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              No recommendations yet. Take our quiz to get personalized recommendations!
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <span>Take Quiz</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group relative"
              >
                {device.score && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-semibold z-10">
                    {Math.round(device.score)}% Match
                  </div>
                )}
                <Link href={`/devices/${device.id}`}>
                  <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
                    {device.imageUrl ? (
                      <Image
                        src={device.imageUrl}
                        alt={device.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{device.brand}</div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{device.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{device.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({device.reviewCount})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold gradient-text">
                        ₹{device.price.toLocaleString('en-IN')}
                      </div>
                      <button className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                        <ShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

