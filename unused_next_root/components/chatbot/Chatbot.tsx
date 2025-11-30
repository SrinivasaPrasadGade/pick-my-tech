'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'maverick'
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I'm Maverick, your tech assistant. I can help you navigate the app, find devices, answer questions, and provide recommendations. How can I help you today?",
      sender: 'maverick',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const response = generateResponse(input)
      const maverickMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'maverick',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, maverickMessage])
    }, 1000)
  }

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return "Hello! I'm Maverick, your tech assistant. How can I help you today?"
    }

    if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest')) {
      return "I'd be happy to help you find the perfect device! You can take our quiz by clicking 'Get Started' on the homepage, or I can help you browse devices. What type of device are you looking for?"
    }

    if (lowerQuery.includes('laptop') || lowerQuery.includes('computer')) {
      return "Great choice! You can browse laptops in our Devices section. What will you be using it for? (gaming, work, content creation, etc.) This will help me give you better recommendations."
    }

    if (lowerQuery.includes('phone') || lowerQuery.includes('mobile')) {
      return "I can help you find the perfect phone! Check out our Devices section or take the quiz for personalized recommendations. What's your budget range and preferred brand?"
    }

    if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
      return "Our platform shows real-time prices from multiple e-commerce platforms. You can compare prices directly on each device page and get the best deals!"
    }

    if (lowerQuery.includes('news') || lowerQuery.includes('trending')) {
      return "Check out our Tech News section to stay updated with the latest tech trends, product launches, and industry news. There's always something exciting happening!"
    }

    if (lowerQuery.includes('community') || lowerQuery.includes('review')) {
      return "Our Community section is a great place to connect with other users, read reviews, and share experiences. You'll find authentic insights from real users!"
    }

    if (lowerQuery.includes('spec') || lowerQuery.includes('feature')) {
      return "Each device page has detailed specifications. If you're not sure what a feature means, just click on it for a quick explanation!"
    }

    if (lowerQuery.includes('compare')) {
      return "You can compare multiple devices side-by-side! Just select the devices you're interested in and click the compare button to see detailed comparisons."
    }

    return "I understand you're looking for information. Let me help you navigate: You can browse devices, read tech news, join the community, or take our quiz for personalized recommendations. What would you like to explore?"
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-purple-500/50 transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold">Maverick</div>
                <div className="text-xs opacity-90">Tech Assistant</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Maverick anything..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

