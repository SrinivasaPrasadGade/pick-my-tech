'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Recommendations</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Find Your Perfect
          <br />
          <span className="gradient-text">Tech Companion</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Discover the ideal mobile, laptop, or gadget that perfectly matches your needs, budget, and lifestyle. 
          Powered by intelligent AI recommendations and real-time data.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/quiz"
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            prefetch
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/devices"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold text-lg border-2 border-gray-300 dark:border-gray-700 hover:border-purple-500 transition-all duration-300"
          >
            Browse Devices
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
            <div className="text-gray-600 dark:text-gray-400">Devices</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
            <div className="text-gray-600 dark:text-gray-400">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">98%</div>
            <div className="text-gray-600 dark:text-gray-400">Accuracy</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  )
}

