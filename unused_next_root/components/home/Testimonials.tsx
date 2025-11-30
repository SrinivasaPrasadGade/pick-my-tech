'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    content: 'PickMyTech helped me find the perfect laptop for my development work. The recommendations were spot-on, and the detailed comparisons made my decision easy.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Gaming Enthusiast',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    content: 'As a gamer, I needed a device with specific requirements. The AI recommendations understood my needs perfectly, and I couldn\'t be happier with my purchase.',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    role: 'Content Creator',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    content: 'The community section and real-time pricing features are amazing. I saved both time and money by using PickMyTech for my latest gadget purchase.',
    rating: 5,
  },
]

export default function Testimonials() {
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
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied users
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow relative"
            >
              <Quote className="w-12 h-12 text-purple-600 dark:text-purple-400 opacity-20 mb-4" />
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 overflow-hidden">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

