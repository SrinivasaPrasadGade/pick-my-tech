'use client'

import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FeatureTooltipProps {
  featureName: string
  children: React.ReactNode
}

const featureDescriptions: Record<string, string> = {
  ram: 'Random Access Memory (RAM) stores data that your device is actively using. More RAM allows for smoother multitasking and better performance.',
  storage: 'Storage capacity determines how many files, apps, photos, and videos you can store on your device.',
  processor: 'The processor (CPU) is the brain of your device. It determines how fast your device can perform tasks and run applications.',
  gpu: 'Graphics Processing Unit (GPU) handles rendering images and video. Important for gaming, video editing, and graphics-intensive tasks.',
  display: 'The screen size and resolution determine the quality of visual content you\'ll see. Higher resolution means sharper images.',
  battery: 'Battery capacity determines how long your device can run on a single charge. Measured in mAh (milliampere-hours).',
  camera: 'Camera specifications include megapixels, aperture, and other features that determine photo and video quality.',
  'rear camera': 'Megapixels determine image resolution. However, higher megapixels don\'t always mean better photos. Sensor size and software processing matter more.',
  'front camera': 'Front-facing camera for selfies and video calls. Megapixel count affects detail, but software optimization is equally important for quality.',
  'video': 'Video recording capabilities including resolution (4K, 1080p) and frame rates (fps). Higher resolution and frame rates provide smoother, more detailed videos.',
  capacity: 'Battery capacity determines how long your device can run on a single charge. Measured in mAh (milliampere-hours). Higher mAh generally means longer battery life.',
  'fast charge': 'Fast charging technology allows your device to charge much faster than standard charging. This feature is essential for quick power-ups when you\'re in a hurry.',
  os: 'Operating System (OS) is the software that runs on your device. Examples include iOS, Android, Windows, macOS.',
  'operating system': 'Operating System (OS) is the software that runs on your device. Examples include iOS, Android, Windows, macOS.',
}

export default function FeatureTooltip({ featureName, children }: FeatureTooltipProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Match feature name with descriptions (case-insensitive, handle variations)
  const getDescription = () => {
    const lowerName = featureName.toLowerCase().trim()
    // Exact match first
    if (featureDescriptions[lowerName]) {
      return featureDescriptions[lowerName]
    }
    // Check for partial matches (e.g., "rear camera" in "Rear Camera: 48MP")
    for (const [key, desc] of Object.entries(featureDescriptions)) {
      if (lowerName.includes(key) || key.includes(lowerName)) {
        return desc
      }
    }
    // Check for common patterns
    if (lowerName.includes('camera') || lowerName.includes('megapixel')) {
      return featureDescriptions['rear camera'] || featureDescriptions['camera'] || 'Camera specifications determine photo and video quality.'
    }
    if (lowerName.includes('battery') || lowerName.includes('capacity')) {
      return featureDescriptions['capacity'] || featureDescriptions['battery'] || 'Battery capacity determines how long your device can run on a single charge.'
    }
    if (lowerName.includes('ram') || lowerName.includes('memory')) {
      return featureDescriptions['ram'] || 'Random Access Memory stores data that your device is actively using.'
    }
    if (lowerName.includes('processor') || lowerName.includes('cpu')) {
      return featureDescriptions['processor'] || 'The processor is the brain of your device, determining how fast it can perform tasks.'
    }
    return 'Feature information not available.'
  }
  
  const description = getDescription()

  return (
    <>
      <div className="inline-flex items-center gap-2">
        {children}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
          aria-label="Show feature information"
        >
          <Info className="w-3 h-3 text-purple-600 dark:text-purple-400" />
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                
                <h3 className="text-2xl font-bold mb-3 capitalize text-gray-900 dark:text-white">
                  {featureName.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

