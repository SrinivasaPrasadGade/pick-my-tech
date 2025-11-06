'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import Image from 'next/image'

// This would normally come from an API
const trendingDevices = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 159900,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    price: 249900,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 129999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
  },
  {
    id: '4',
    name: 'Dell XPS 15',
    brand: 'Dell',
    price: 189999,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
  },
]

export default function TrendingDevices() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trending <span className="gradient-text">Devices</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Most popular devices right now
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/devices"
              className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingDevices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
            >
              <Link href={`/devices/${device.id}`}>
                <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={device.image}
                    alt={device.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{device.brand}</div>
                  <h3 className="text-xl font-semibold mb-2">{device.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{device.rating}</span>
                    </div>
                    <div className="text-2xl font-bold gradient-text">
                      ₹{device.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

