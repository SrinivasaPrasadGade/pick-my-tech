import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRobot, FaTimes, FaPaperPlane, FaBolt } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! I'm Maverick, your tech assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chatbot', { message: userMessage.text });
      const botResponse = {
        type: 'bot',
        text: res.data.response,
        suggestions: res.data.suggestions,
        action: res.data.action,
        data: res.data.data,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);

      // Handle actions
      if (botResponse.action === 'navigate' && botResponse.data?.path) {
        setTimeout(() => {
          navigate(botResponse.data.path);
          setIsOpen(false);
        }, 1000);
      } else if (botResponse.action === 'search' && botResponse.data) {
        setTimeout(() => {
          const params = new URLSearchParams();
          if (botResponse.data.category) params.append('category', botResponse.data.category);
          if (botResponse.data.brand) params.append('brand', botResponse.data.brand);
          if (botResponse.data.maxPrice) params.append('maxPrice', botResponse.data.maxPrice);
          navigate(`/devices?${params.toString()}`);
          setIsOpen(false);
        }, 1000);
      } else if (botResponse.action === 'recommend') {
        setTimeout(() => {
          navigate('/recommendations');
          setIsOpen(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
    // Auto-send suggestion
    setTimeout(() => {
      const event = new Event('submit');
      handleSend(event);
    }, 100);
  };

  const quickActions = [
    { text: 'Find phones', action: 'Find mobile phones' },
    { text: 'Browse laptops', action: 'Show me laptops' },
    { text: 'Get recommendations', action: 'Get recommendations' },
    { text: 'Tech news', action: 'Show tech news' }
  ];

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <FaRobot />
          <span>Maverick</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <FaRobot className="robot-icon" />
              <div>
                <h3>Maverick</h3>
                <p>Your Tech Assistant</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content">
                  <p>{msg.text}</p>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="suggestions">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="suggestion-btn"
                          onClick={() => handleSuggestion(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="quick-actions">
              <p>Quick Actions:</p>
              <div className="quick-buttons">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="quick-btn"
                    onClick={() => handleSuggestion(action.action)}
                  >
                    <FaBolt /> {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSend} className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;

