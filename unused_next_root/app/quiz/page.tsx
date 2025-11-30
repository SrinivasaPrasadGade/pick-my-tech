'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'

interface QuizAnswers {
  deviceType: string
  usageType: string
  budget: string
  preferredBrands: string[]
  priorities: string[]
  screenSize?: string
  batteryLife?: string
  camera?: string
}

export default function QuizPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({
    deviceType: '',
    usageType: '',
    budget: '',
    preferredBrands: [],
    priorities: [],
  })

  const steps = [
    {
      question: 'What type of device are you looking for?',
      options: ['Mobile Phone', 'Laptop', 'Tablet', 'Smartwatch', 'Headphones', 'Camera'],
      key: 'deviceType',
    },
    {
      question: 'What will be your primary usage?',
      options: ['Gaming', 'Productivity/Work', 'Photography/Video', 'Content Creation', 'General Use', 'Business'],
      key: 'usageType',
    },
    {
      question: 'What is your budget range?',
      options: ['Under ₹20,000', '₹20,000 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹2,00,000', 'Above ₹2,00,000'],
      key: 'budget',
    },
    {
      question: 'Do you have any preferred brands? (Select all that apply)',
      options: ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'OnePlus', 'Xiaomi', 'Sony', 'No Preference'],
      key: 'preferredBrands',
      multiSelect: true,
    },
    {
      question: 'What matters most to you? (Select top 3)',
      options: ['Performance', 'Battery Life', 'Camera Quality', 'Display Quality', 'Build Quality', 'Price', 'Software Updates', 'Storage'],
      key: 'priorities',
      multiSelect: true,
      maxSelections: 3,
    },
  ]

  const handleAnswer = (option: string) => {
    const currentQuestion = steps[currentStep]
    
    if (currentQuestion.multiSelect) {
      const currentAnswers = (answers[currentQuestion.key as keyof QuizAnswers] as string[]) || []
      if (currentQuestion.maxSelections) {
        if (currentAnswers.includes(option)) {
          setAnswers({
            ...answers,
            [currentQuestion.key]: currentAnswers.filter((a) => a !== option),
          })
        } else if (currentAnswers.length < currentQuestion.maxSelections) {
          setAnswers({
            ...answers,
            [currentQuestion.key]: [...currentAnswers, option],
          })
        }
      } else {
        if (currentAnswers.includes(option)) {
          setAnswers({
            ...answers,
            [currentQuestion.key]: currentAnswers.filter((a) => a !== option),
          })
        } else {
          setAnswers({
            ...answers,
            [currentQuestion.key]: [...currentAnswers, option],
          })
        }
      }
    } else {
      setAnswers({
        ...answers,
        [currentQuestion.key]: option,
      })
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      if (response.ok) {
        router.push('/recommendations')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
    }
  }

  const currentQuestion = steps[currentStep]
  const currentAnswer = answers[currentQuestion.key as keyof QuizAnswers]
  const canProceed = currentQuestion.multiSelect
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : Boolean(currentAnswer)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option) => {
              const isSelected = currentQuestion.multiSelect
                ? (currentAnswer as string[]).includes(option)
                : currentAnswer === option

              return (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100'
                      : 'border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  {option}
                  {currentQuestion.multiSelect && isSelected && (
                    <span className="ml-2 text-purple-600">✓</span>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              <span>{currentStep === steps.length - 1 ? 'Submit' : 'Next'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

