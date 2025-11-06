'use client'

import { motion } from 'framer-motion'
import { Sparkles, Filter, TrendingUp, Users, Zap, Shield, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Recommendations',
    description: 'Get personalized device recommendations based on your usage patterns, preferences, and budget using advanced machine learning algorithms.',
  },
  {
    icon: Filter,
    title: 'Advanced Filtering',
    description: 'Filter through thousands of devices using intelligent filters for specifications, price range, brand, and performance metrics.',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Pricing',
    description: 'Compare prices across multiple e-commerce platforms with live updates and direct purchase links.',
  },
  {
    icon: Users,
    title: 'Community Insights',
    description: 'Connect with other users, read authentic reviews, and share experiences about your favorite devices.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience blazing-fast search and recommendations with optimized performance and smooth interactions.',
  },
  {
    icon: Shield,
    title: 'Trusted Information',
    description: 'Get accurate, up-to-date specifications and detailed feature explanations from reliable sources.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Comparisons',
    description: 'Compare multiple devices side-by-side with comprehensive specifications and performance metrics.',
  },
  {
    icon: TrendingUp,
    title: 'Tech News & Trends',
    description: 'Stay updated with the latest tech news, product launches, and industry trends that matter.',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">PickMyTech</span>?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We combine cutting-edge technology with user-centric design to deliver an unmatched experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

