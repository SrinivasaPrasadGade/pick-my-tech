'use client'

import { motion } from 'framer-motion'
import { User, Sparkles, ShoppingBag, ThumbsUp } from 'lucide-react'

const steps = [
  {
    icon: User,
    title: 'Sign Up & Take Quiz',
    description: 'Create your account and answer a few simple questions about your preferences, usage type, and budget.',
    step: '01',
  },
  {
    icon: Sparkles,
    title: 'Get AI Recommendations',
    description: 'Our intelligent system analyzes your requirements and suggests the perfect devices tailored just for you.',
    step: '02',
  },
  {
    icon: ShoppingBag,
    title: 'Compare & Explore',
    description: 'Browse through detailed specifications, compare multiple devices, and explore features with explanations.',
    step: '03',
  },
  {
    icon: ThumbsUp,
    title: 'Make Informed Decision',
    description: 'Purchase with confidence using real-time pricing, community reviews, and direct purchase links.',
    step: '04',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Getting your perfect device recommendation is simple and fast.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 transform translate-x-4 z-0" />
              )}
              <div className="relative z-10 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {step.step}
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

