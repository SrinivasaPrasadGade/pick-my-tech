'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare, ThumbsUp, Plus, Clock, User } from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  category: string
  upvotes: number
  comments: number
  createdAt: string
  user: {
    name: string
    image?: string
  }
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'general', 'review', 'question', 'discussion']

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/community/posts?category=${selectedCategory}`)
      const data = await response.json()
      setPosts(data.posts || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setLoading(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks === 1) return '1 week ago'
    return `${diffInWeeks} weeks ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community <span className="gradient-text">Forum</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Connect, share, and learn from other tech enthusiasts
            </p>
          </div>
          {session && (
            <Link
              href="/community/new"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              <span>New Post</span>
            </Link>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
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

        {/* Posts */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">No posts found.</p>
            {session && (
              <Link
                href="/community/new"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Post</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
              >
                <Link href={`/community/${post.id}`}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      {post.user.image ? (
                        <img
                          src={post.user.image}
                          alt={post.user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold">{post.user.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{getTimeAgo(post.createdAt)}</span>
                        </span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs capitalize">
                          {post.category}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <ThumbsUp className="w-5 h-5" />
                          <span>{post.upvotes}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-5 h-5" />
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

