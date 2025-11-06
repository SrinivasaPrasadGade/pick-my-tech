'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star, ShoppingBag, ExternalLink, Heart, Share2 } from 'lucide-react'
import FeatureTooltip from '@/components/devices/FeatureTooltip'

interface Device {
  id: string
  name: string
  brand: string
  category: string
  price: number
  rating: number
  reviewCount: number
  imageUrl?: string
  specifications: any
  features: string[]
  pros: string[]
  cons: string[]
  amazonUrl?: string
  flipkartUrl?: string
}

export default function DeviceDetailPage() {
  const params = useParams()
  const [device, setDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('specs')

  useEffect(() => {
    fetchDevice()
  }, [params.id])

  const fetchDevice = async () => {
    try {
      const response = await fetch(`/api/devices/${params.id}`)
      const data = await response.json()
      setDevice(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching device:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading device details...</p>
        </div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Device not found</p>
      </div>
    )
  }

  const specs = typeof device.specifications === 'string' 
    ? JSON.parse(device.specifications) 
    : device.specifications

  const features = typeof device.features === 'string'
    ? JSON.parse(device.features)
    : device.features

  const pros = typeof device.pros === 'string'
    ? JSON.parse(device.pros || '[]')
    : device.pros || []

  const cons = typeof device.cons === 'string'
    ? JSON.parse(device.cons || '[]')
    : device.cons || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
          >
            {device.imageUrl ? (
              <div className="relative h-96 w-full">
                <Image
                  src={device.imageUrl}
                  alt={device.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                No Image Available
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{device.brand}</div>
              <h1 className="text-4xl font-bold mb-4">{device.name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-semibold">{device.rating}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  ({device.reviewCount} reviews)
                </span>
              </div>
              <div className="text-4xl font-bold gradient-text mb-6">
                ₹{device.price.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {device.amazonUrl && (
                <a
                  href={device.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Buy on Amazon</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {device.flipkartUrl && (
                <a
                  href={device.flipkartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Buy on Flipkart</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Pros and Cons */}
            {(pros.length > 0 || cons.length > 0) && (
              <div className="grid grid-cols-2 gap-4">
                {pros.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                    <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Pros</h3>
                    <ul className="space-y-1 text-sm">
                      {pros.map((pro: string, index: number) => (
                        <li key={index} className="text-green-600 dark:text-green-300">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {cons.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Cons</h3>
                    <ul className="space-y-1 text-sm">
                      {cons.map((con: string, index: number) => (
                        <li key={index} className="text-red-600 dark:text-red-300">• {con}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-800 mb-6">
            {['specs', 'features', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(specs).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-start space-x-3">
                    <div className="flex-1">
                      <FeatureTooltip featureName={key}>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </FeatureTooltip>
                      <div className="text-gray-600 dark:text-gray-400">{String(value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4">
                {features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Reviews feature coming soon. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

