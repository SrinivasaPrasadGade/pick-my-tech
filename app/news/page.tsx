'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, ExternalLink, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: {
    name: string
  }
  category?: string
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'mobile', 'laptop', 'gadgets', 'tech', 'ai', 'gaming']

  useEffect(() => {
    fetchNews()
  }, [selectedCategory])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/news?category=${selectedCategory}`)
      const data = await response.json()
      setArticles(data.articles || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching news:', error)
      // Fallback data
      setArticles([])
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 mb-6"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Stay Updated</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tech <span className="gradient-text">News</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Latest tech news, product launches, and industry insights
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all capitalize ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-purple-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading latest news...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400">No news articles found.</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Please configure NEWS_API_KEY in your .env file to see real-time news.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <motion.article
                key={article.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                {article.urlToImage && (
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeAgo(article.publishedAt)}</span>
                    <span>•</span>
                    <span>{article.source.name}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm"
                  >
                    <span>Read More</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

