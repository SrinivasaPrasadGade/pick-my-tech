import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import './Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    deviceType: '',
    usageType: [],
    budgetRange: '',
    preferredBrands: [],
    priorities: [],
    screenSize: '',
    storage: '',
    battery: ''
  });

  const questions = [
    {
      id: 'deviceType',
      question: 'What type of device are you looking for?',
      type: 'single',
      options: [
        { value: 'mobile', label: 'Mobile Phone', icon: '📱' },
        { value: 'laptop', label: 'Laptop', icon: '💻' },
        { value: 'tablet', label: 'Tablet', icon: '📱' },
        { value: 'smartwatch', label: 'Smartwatch', icon: '⌚' },
        { value: 'headphones', label: 'Headphones/Earbuds', icon: '🎧' }
      ]
    },
    {
      id: 'usageType',
      question: 'How do you plan to use your device? (Select all that apply)',
      type: 'multiple',
      options: [
        { value: 'gaming', label: 'Gaming' },
        { value: 'productivity', label: 'Productivity/Work' },
        { value: 'photography', label: 'Photography' },
        { value: 'video', label: 'Video Editing/Streaming' },
        { value: 'social', label: 'Social Media & Communication' },
        { value: 'content', label: 'Content Creation' },
        { value: 'entertainment', label: 'Entertainment (Music, Videos)' },
        { value: 'basic', label: 'Basic Usage (Calls, Email, Web)' }
      ]
    },
    {
      id: 'budgetRange',
      question: 'What is your budget range?',
      type: 'single',
      options: [
        { value: 'under-500', label: 'Under $500' },
        { value: '500-1000', label: '$500 - $1,000' },
        { value: '1000-2000', label: '$1,000 - $2,000' },
        { value: '2000-3000', label: '$2,000 - $3,000' },
        { value: 'above-3000', label: 'Above $3,000' },
        { value: 'flexible', label: 'Flexible - Show me options' }
      ]
    },
    {
      id: 'preferredBrands',
      question: 'Do you have any brand preferences? (Select all that apply)',
      type: 'multiple',
      options: [
        { value: 'Apple', label: 'Apple' },
        { value: 'Samsung', label: 'Samsung' },
        { value: 'Google', label: 'Google' },
        { value: 'Xiaomi', label: 'Xiaomi' },
        { value: 'Realme', label: 'Realme' },
        { value: 'Redmi', label: 'Redmi' },
        { value: 'Poco', label: 'Poco' },
        { value: 'Oppo', label: 'Oppo' },
        { value: 'OnePlus', label: 'OnePlus' },
        { value: 'Dell', label: 'Dell' },
        { value: 'HP', label: 'HP' },
        { value: 'Lenovo', label: 'Lenovo' },
        { value: 'Asus', label: 'Asus' },
        { value: 'MSI', label: 'MSI' },
        { value: 'Motorola', label: 'Motorola' },
        { value: 'Sony', label: 'Sony' },
        { value: 'No Preference', label: 'No Preference' }
      ]
    },
    {
      id: 'priorities',
      question: 'What matters most to you? (Select top 3)',
      type: 'multiple',
      maxSelections: 3,
      options: [
        { value: 'performance', label: 'Performance & Speed' },
        { value: 'battery', label: 'Battery Life' },
        { value: 'display', label: 'Display Quality' },
        { value: 'storage', label: 'Storage Space' },
        { value: 'camera', label: 'Camera Quality' },
        { value: 'design', label: 'Design & Build Quality' },
        { value: 'price', label: 'Value for Money' },
        { value: 'durability', label: 'Durability & Reliability' }
      ]
    },
    {
      id: 'screenSize',
      question: 'What screen size do you prefer?',
      type: 'single',
      conditional: ['deviceType', ['mobile', 'tablet']],
      options: [
        { value: 'small', label: 'Small (under 5.5")' },
        { value: 'medium', label: 'Medium (5.5" - 6.5")' },
        { value: 'large', label: 'Large (6.5" - 7")' },
        { value: 'extra-large', label: 'Extra Large (7"+)' },
        { value: 'no-preference', label: 'No Preference' }
      ]
    },
    {
      id: 'storage',
      question: 'How much storage do you need?',
      type: 'single',
      conditional: ['deviceType', ['mobile', 'tablet', 'laptop']],
      options: [
        { value: '64gb', label: '64GB' },
        { value: '128gb', label: '128GB' },
        { value: '256gb', label: '256GB' },
        { value: '512gb', label: '512GB' },
        { value: '1tb', label: '1TB or more' },
        { value: 'expandable', label: 'Expandable (SD Card)' }
      ]
    },
    {
      id: 'battery',
      question: 'How important is battery life?',
      type: 'single',
      options: [
        { value: 'critical', label: 'Critical - Must last all day' },
        { value: 'important', label: 'Important - Should last a full day' },
        { value: 'moderate', label: 'Moderate - Few hours is fine' },
        { value: 'not-important', label: 'Not Important - I charge frequently' }
      ]
    }
  ];

  // Filter questions based on conditions using useMemo for performance
  const visibleQuestions = useMemo(() => {
    return questions.filter(q => {
      if (q.conditional) {
        const [field, values] = q.conditional;
        return answers[field] && values.includes(answers[field]);
      }
      return true;
    });
  }, [answers]);

  const handleAnswer = (questionId, value) => {
    const currentQuestion = visibleQuestions[currentStep];
    if (currentQuestion.type === 'multiple') {
      const currentAnswers = answers[questionId] || [];
      let newAnswers;
      
      if (currentAnswers.includes(value)) {
        // Remove if already selected
        newAnswers = currentAnswers.filter(v => v !== value);
      } else {
        // Add if not selected
        if (currentQuestion.maxSelections && currentAnswers.length >= currentQuestion.maxSelections) {
          // Don't add if max selections reached
          return;
        }
        newAnswers = [...currentAnswers, value];
      }
      
      setAnswers(prev => ({
        ...prev,
        [questionId]: newAnswers
      }));
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < visibleQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      await axios.post('/api/quiz', answers);
      navigate('/recommendations');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  };

  const canProceed = () => {
    const currentQuestion = visibleQuestions[currentStep];
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'multiple') {
      return answer && answer.length > 0;
    }
    return answer && answer !== '';
  };

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / visibleQuestions.length) * 100}%` }}
            />
          </div>
          <p>Question {currentStep + 1} of {visibleQuestions.length}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="quiz-content"
          >
            <h2 className="quiz-question">{visibleQuestions[currentStep].question}</h2>
            {visibleQuestions[currentStep].maxSelections && (
              <p className="quiz-hint">Select up to {visibleQuestions[currentStep].maxSelections} options</p>
            )}
            <div className="quiz-options">
              {visibleQuestions[currentStep].options.map(option => {
                const isSelected = visibleQuestions[currentStep].type === 'multiple'
                  ? answers[visibleQuestions[currentStep].id]?.includes(option.value)
                  : answers[visibleQuestions[currentStep].id] === option.value;

                const maxReached = visibleQuestions[currentStep].maxSelections && 
                  visibleQuestions[currentStep].type === 'multiple' &&
                  answers[visibleQuestions[currentStep].id]?.length >= visibleQuestions[currentStep].maxSelections &&
                  !isSelected;

                return (
                  <button
                    key={option.value}
                    className={`quiz-option ${isSelected ? 'selected' : ''} ${maxReached ? 'disabled' : ''}`}
                    onClick={() => handleAnswer(visibleQuestions[currentStep].id, option.value)}
                    disabled={maxReached}
                  >
                    {option.icon && <span className="option-icon">{option.icon}</span>}
                    <span>{option.label}</span>
                    {isSelected && <FaCheck className="check-icon" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="quiz-navigation">
          <button
            className="btn-nav"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <FaArrowLeft /> Previous
          </button>
          <button
            className="btn-nav btn-primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === visibleQuestions.length - 1 ? 'Complete Quiz' : 'Next'}
            {currentStep < visibleQuestions.length - 1 && <FaArrowRight />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

