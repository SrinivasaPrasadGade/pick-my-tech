import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowRight, FaArrowLeft, FaCheck, FaLaptop, FaMobileAlt,
  FaTabletAlt, FaHeadphones, FaGamepad, FaBriefcase, FaGraduationCap,
  FaPlane, FaRunning, FaCamera, FaPalette, FaBatteryFull, FaMicrochip,
  FaHdd, FaLeaf, FaRobot, FaLayerGroup
} from 'react-icons/fa';
import './Quiz.css';

// Questions Data Structure - Moved outside component to prevent re-creation
const questions = [
  // Section 1: The Basics & Lifestyle
  {
    section: "The Basics & Lifestyle",
    id: 'lifestyle_type',
    question: "Welcome! To get started, how would you describe your primary daily grind?",
    type: 'single-card',
    options: [
      { value: 'student', label: 'Student', icon: <FaGraduationCap />, desc: "Juggling classes & assignments" },
      { value: 'creative', label: 'Creative Pro', icon: <FaPalette />, desc: "Designing, editing, creating" },
      { value: 'corporate', label: 'Corporate/Office', icon: <FaBriefcase />, desc: "Meetings, emails, workflows" },
      { value: 'remote', label: 'Remote Worker', icon: <FaLaptop />, desc: "Working from anywhere" },
      { value: 'gamer', label: 'Gamer/Enthusiast', icon: <FaGamepad />, desc: "Living on the bleeding edge" },
      { value: 'casual', label: 'Casual User', icon: <FaMobileAlt />, desc: "Simple and reliable" }
    ]
  },
  {
    section: "The Basics & Lifestyle",
    id: 'mobility',
    question: "How does your day usually look regarding movement?",
    type: 'slider-select',
    options: [
      { value: 'stationary', label: 'Stationary', desc: "Mostly at a desk/home" },
      { value: 'commuter', label: 'Commuter', desc: "Daily travel to work/school" },
      { value: 'nomad', label: 'Digital Nomad', desc: "Always moving, frequent travel" },
      { value: 'active', label: 'Active', desc: "Gym, outdoors, on the go" }
    ]
  },
  {
    section: "The Basics & Lifestyle",
    id: 'downtime',
    question: "When you're not working, what's your go-to downtime activity?",
    type: 'multi-card',
    maxSelections: 3,
    options: [
      { value: 'streaming', label: 'Streaming', icon: <FaMobileAlt /> },
      { value: 'gaming', label: 'Gaming', icon: <FaGamepad /> },
      { value: 'reading', label: 'Reading', icon: <FaLaptop /> },
      { value: 'creative', label: 'Creative', icon: <FaPalette /> },
      { value: 'fitness', label: 'Fitness', icon: <FaRunning /> },
      { value: 'social', label: 'Social', icon: <FaLayerGroup /> }
    ]
  },

  // Section 2: Usage & Habits
  {
    section: "Usage & Habits",
    id: 'workflow',
    question: "Which of these sounds most like your digital workflow?",
    type: 'single-text',
    options: [
      { value: 'focus', label: 'Focus Mode', desc: "I do one thing at a time, deeply." },
      { value: 'multitasker', label: 'Multitasker', desc: "50 tabs open and 3 apps running." },
      { value: 'creator', label: 'Creator', desc: "Constantly editing, rendering, compiling." },
      { value: 'consumer', label: 'Consumer', desc: "Mostly watch, read, and listen." }
    ]
  },
  {
    section: "Usage & Habits",
    id: 'usage_time',
    question: "How much time do you spend on your primary device daily?",
    type: 'slider-range',
    min: 1,
    max: 12,
    unit: 'hours'
  },
  {
    section: "Usage & Habits",
    id: 'creation_ratio',
    question: "Content Creation vs. Consumption Ratio?",
    type: 'slider-balance',
    leftLabel: "Consumption",
    rightLabel: "Creation"
  },

  // Section 3: Current Tech Ecosystem
  {
    section: "Current Tech Ecosystem",
    id: 'ecosystem',
    question: "Which ecosystem feels like 'home' to you right now?",
    type: 'single-card',
    options: [
      { value: 'apple', label: 'Apple Garden', icon: <FaMobileAlt />, desc: "iMessage, iCloud, iPhone" },
      { value: 'google', label: 'Google/Android', icon: <FaRobot />, desc: "Workspace, Android, Assistant" },
      { value: 'windows', label: 'Windows', icon: <FaLaptop />, desc: "Office 365, PC Gaming" },
      { value: 'mixed', label: 'Mixed/Agnostic', icon: <FaLayerGroup />, desc: "Best tool for the job" }
    ]
  },
  {
    section: "Current Tech Ecosystem",
    id: 'devices_owned',
    question: "What devices do you currently own and use regularly?",
    type: 'multi-card',
    options: [
      { value: 'smartphone', label: 'Smartphone', icon: <FaMobileAlt /> },
      { value: 'laptop', label: 'Laptop', icon: <FaLaptop /> },
      { value: 'tablet', label: 'Tablet', icon: <FaTabletAlt /> },
      { value: 'smartwatch', label: 'Smartwatch', icon: <FaRunning /> },
      { value: 'earbuds', label: 'Earbuds', icon: <FaHeadphones /> },
      { value: 'pc', label: 'Desktop PC', icon: <FaHdd /> },
      { value: 'console', label: 'Console', icon: <FaGamepad /> }
    ]
  },
  {
    section: "Current Tech Ecosystem",
    id: 'tech_savviness',
    question: "How tech-savvy would you say you are?",
    type: 'single-text',
    options: [
      { value: 'novice', label: 'Novice', desc: "I need help setting up Wi-Fi." },
      { value: 'average', label: 'Average', desc: "I can troubleshoot basic issues." },
      { value: 'expert', label: 'Expert', desc: "I build PCs / root phones." }
    ]
  },

  // Section 4: Preferences & Priorities
  {
    section: "Preferences & Priorities",
    id: 'budget_style',
    question: "When buying new tech, what's your budget philosophy?",
    type: 'single-text',
    options: [
      { value: 'value', label: 'Value Hunter', desc: "Best bang for the buck." },
      { value: 'balanced', label: 'Balanced', desc: "Quality without luxury markup." },
      { value: 'premium', label: 'Premium', desc: "Best experience, price secondary." },
      { value: 'future', label: 'Future-Proofer', desc: "Spend more now to last longer." }
    ]
  },
  {
    section: "Preferences & Priorities",
    id: 'priorities',
    question: "Rank these features in order of importance (Tap to select in order)",
    type: 'ranking',
    options: [
      { value: 'performance', label: 'Performance', icon: <FaMicrochip /> },
      { value: 'battery', label: 'Battery Life', icon: <FaBatteryFull /> },
      { value: 'camera', label: 'Camera', icon: <FaCamera /> },
      { value: 'display', label: 'Display', icon: <FaMobileAlt /> },
      { value: 'portability', label: 'Portability', icon: <FaPlane /> },
      { value: 'durability', label: 'Durability', icon: <FaHdd /> }
    ]
  },
  {
    section: "Preferences & Priorities",
    id: 'brand_loyalty',
    question: "Are you open to trying new brands?",
    type: 'single-text',
    options: [
      { value: 'loyalist', label: 'Loyalist', desc: "I stick to trusted brands." },
      { value: 'open', label: 'Open-Minded', desc: "Willing to switch for better products." },
      { value: 'adventurous', label: 'Adventurous', desc: "Love trying new/niche brands." }
    ]
  },

  // Section 5: Pain Points & Future
  {
    section: "Pain Points & Future",
    id: 'frustration',
    question: "What is the biggest frustration with your CURRENT device?",
    type: 'single-text',
    options: [
      { value: 'battery', label: 'Battery dies too fast' },
      { value: 'performance', label: 'Slow / Laggy' },
      { value: 'storage', label: 'Storage full' },
      { value: 'camera', label: 'Bad photos' },
      { value: 'damage', label: 'Screen cracked / Broken' },
      { value: 'upgrade', label: 'Just want an upgrade' }
    ]
  },
  {
    section: "Pain Points & Future",
    id: 'upgrade_cycle',
    question: "How long do you typically keep a device?",
    type: 'single-text',
    options: [
      { value: '1-2', label: '1-2 Years' },
      { value: '3-4', label: '3-4 Years' },
      { value: '5+', label: '5+ Years' }
    ]
  },
  {
    section: "Pain Points & Future",
    id: 'emerging_tech',
    question: "Are you interested in emerging technologies?",
    type: 'multi-card',
    options: [
      { value: 'foldable', label: 'Foldables', icon: <FaMobileAlt /> },
      { value: 'ai', label: 'AI Features', icon: <FaRobot /> },
      { value: 'vr', label: 'AR/VR', icon: <FaHeadphones /> },
      { value: 'eco', label: 'Eco-Friendly', icon: <FaLeaf /> }
    ]
  }
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    lifestyle: {},
    usage: {},
    tech_context: {},
    priorities: {},
    budget: {},
    pain_points: [],
    future: {}
  });

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => {
      return { ...prev, [questionId]: value };
    });
  };

  const handleMultiSelect = (questionId, value, maxSelections) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
      } else {
        if (maxSelections && current.length >= maxSelections) return prev;
        return { ...prev, [questionId]: [...current, value] };
      }
    });
  };

  const handleRanking = (questionId, value) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [questionId]: [...current, value] };
      }
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
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
      const structuredAnswers = {
        lifestyle: {
          type: answers.lifestyle_type,
          mobility: answers.mobility,
          downtime: answers.downtime
        },
        usage: {
          workflow: answers.workflow,
          time: answers.usage_time,
          creation_ratio: answers.creation_ratio
        },
        tech_context: {
          ecosystem: answers.ecosystem,
          devices: answers.devices_owned,
          savviness: answers.tech_savviness
        },
        priorities: {
          budget_style: answers.budget_style,
          ranked: answers.priorities,
          brand_loyalty: answers.brand_loyalty
        },
        pain_points: [answers.frustration],
        future: {
          upgrade_cycle: answers.upgrade_cycle,
          interests: answers.emerging_tech
        }
      };

      await axios.post('/api/quiz', structuredAnswers);
      navigate('/recommendations');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  };

  const currentQ = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Render helper for different question types
  const renderQuestionContent = () => {
    if (!currentQ) return null;

    switch (currentQ.type) {
      case 'single-card':
      case 'single-text':
        return (
          <div className="options-grid">
            {currentQ.options.map(opt => (
              <button
                key={opt.value}
                className={`option-card ${answers[currentQ.id] === opt.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQ.id, opt.value)}
              >
                {opt.icon && <div className="option-icon">{opt.icon}</div>}
                <div className="option-content">
                  <span className="option-label">{opt.label}</span>
                  {opt.desc && <span className="option-desc">{opt.desc}</span>}
                </div>
                {answers[currentQ.id] === opt.value && <FaCheck className="check-mark" />}
              </button>
            ))}
          </div>
        );

      case 'multi-card':
        return (
          <div className="options-grid">
            {currentQ.options.map(opt => {
              const isSelected = (answers[currentQ.id] || []).includes(opt.value);
              return (
                <button
                  key={opt.value}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect(currentQ.id, opt.value, currentQ.maxSelections)}
                >
                  {opt.icon && <div className="option-icon">{opt.icon}</div>}
                  <div className="option-content">
                    <span className="option-label">{opt.label}</span>
                    {opt.desc && <span className="option-desc">{opt.desc}</span>}
                  </div>
                  {isSelected && <FaCheck className="check-mark" />}
                </button>
              );
            })}
          </div>
        );

      case 'slider-select':
        return (
          <div className="slider-select-container">
            {currentQ.options.map((opt, idx) => (
              <button
                key={opt.value}
                className={`slider-option ${answers[currentQ.id] === opt.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQ.id, opt.value)}
              >
                <div className="slider-dot"></div>
                <span className="slider-label">{opt.label}</span>
                <span className="slider-desc">{opt.desc}</span>
              </button>
            ))}
            <div className="slider-line"></div>
          </div>
        );

      case 'slider-range':
        return (
          <div className="range-container">
            <input
              type="range"
              min={currentQ.min}
              max={currentQ.max}
              value={answers[currentQ.id] || Math.floor((currentQ.max - currentQ.min) / 2)}
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              className="range-slider"
            />
            <div className="range-value">
              {answers[currentQ.id] || Math.floor((currentQ.max - currentQ.min) / 2)} {currentQ.unit}
            </div>
          </div>
        );

      case 'slider-balance':
        return (
          <div className="balance-container">
            <div className="balance-labels">
              <span>{currentQ.leftLabel}</span>
              <span>{currentQ.rightLabel}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={answers[currentQ.id] || 50}
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              className="balance-slider"
            />
            <div className="balance-value">
              {answers[currentQ.id] || 50}% {currentQ.rightLabel}
            </div>
          </div>
        );

      case 'ranking':
        const selectedItems = answers[currentQ.id] || [];
        return (
          <div className="ranking-container">
            <div className="ranking-pool">
              <p className="ranking-hint">Tap items to add to your list in order:</p>
              <div className="options-grid small">
                {currentQ.options.filter(opt => !selectedItems.includes(opt.value)).map(opt => (
                  <button
                    key={opt.value}
                    className="option-card small"
                    onClick={() => handleRanking(currentQ.id, opt.value)}
                  >
                    {opt.icon && <div className="option-icon">{opt.icon}</div>}
                    <span className="option-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="ranking-list">
              <p className="ranking-hint">Your Priorities (Top to Bottom):</p>
              {selectedItems.map((val, idx) => {
                const opt = currentQ.options.find(o => o.value === val);
                return (
                  <div key={val} className="ranked-item">
                    <span className="rank-number">{idx + 1}</span>
                    <span className="rank-label">{opt?.label}</span>
                    <button
                      className="remove-rank"
                      onClick={() => handleRanking(currentQ.id, val)}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (!currentQ) return false;
    const val = answers[currentQ.id];
    if (currentQ.type === 'ranking') return val && val.length > 0;
    if (currentQ.type.includes('multi')) return val && val.length > 0;
    return val !== undefined && val !== null && val !== '';
  };

  if (!currentQ) return <div className="quiz-page">Loading...</div>;

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="quiz-meta">
            <span className="section-title">{currentQ.section}</span>
            <span className="step-count">{currentStep + 1} / {questions.length}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="quiz-content-wrapper"
          >
            <h2 className="question-text">{currentQ.question}</h2>
            {currentQ.maxSelections && (
              <p className="selection-hint">Select up to {currentQ.maxSelections}</p>
            )}

            <div className="question-body">
              {renderQuestionContent()}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="quiz-footer">
          <button
            className="nav-btn prev"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <FaArrowLeft /> Back
          </button>
          <button
            className="nav-btn next"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === questions.length - 1 ? 'Finish' : 'Next'} <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
