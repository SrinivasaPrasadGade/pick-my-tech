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
      text: "Hi! 👋 I'm Maverick, your tech assistant. How can I help you today?",
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
  }, [messages, isOpen]);

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
          // Don't close automatically for navigation, let user read the message
        }, 1500);
      } else if (botResponse.action === 'search' && botResponse.data) {
        setTimeout(() => {
          const params = new URLSearchParams();
          if (botResponse.data.category) params.append('category', botResponse.data.category);
          if (botResponse.data.brand) params.append('brand', botResponse.data.brand);
          if (botResponse.data.maxPrice) params.append('maxPrice', botResponse.data.maxPrice);
          navigate(`/devices?${params.toString()}`);
        }, 1500);
      } else if (botResponse.action === 'recommend') {
        setTimeout(() => {
          navigate('/recommendations');
        }, 1500);
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
      // We need to trigger the send logic manually since we can't easily simulate a form submit event with the state update pending
      // So we'll just call a version of handleSend or set a flag
      // For simplicity, let's just set the input and let the user press enter, OR better:
      // We can't easily reuse handleSend because it expects an event. 
      // Let's refactor handleSend to be callable without event or just duplicate logic for now to be safe
      // Actually, the previous implementation had a hacky event simulation. Let's do it properly.
      sendText(suggestion);
    }, 100);
  };

  const sendText = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = {
      type: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chatbot', { message: text });
      const botResponse = {
        type: 'bot',
        text: res.data.response,
        suggestions: res.data.suggestions,
        action: res.data.action,
        data: res.data.data,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);

      if (botResponse.action === 'navigate' && botResponse.data?.path) {
        setTimeout(() => navigate(botResponse.data.path), 1500);
      } else if (botResponse.action === 'search' && botResponse.data) {
        setTimeout(() => {
          const params = new URLSearchParams();
          if (botResponse.data.category) params.append('category', botResponse.data.category);
          if (botResponse.data.brand) params.append('brand', botResponse.data.brand);
          if (botResponse.data.maxPrice) params.append('maxPrice', botResponse.data.maxPrice);
          navigate(`/devices?${params.toString()}`);
        }, 1500);
      } else if (botResponse.action === 'recommend') {
        setTimeout(() => navigate('/recommendations'), 1500);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, error occurred.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { text: 'Find phones', action: 'Find mobile phones' },
    { text: 'Browse laptops', action: 'Show me laptops' },
    { text: 'Get recommendations', action: 'Get recommendations' },
    { text: 'Tech news', action: 'Show tech news' }
  ];

  // Helper to render text with newlines, bold, and bullet points
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      // Handle bullet points
      const isBullet = line.trim().startsWith('- ');
      const content = isBullet ? line.trim().substring(2) : line;

      const formattedContent = content.split(/(\*\*.*?\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={i} className="message-bullet">
            <span className="bullet-point">•</span>
            <span>{formattedContent}</span>
          </div>
        );
      }

      return (
        <React.Fragment key={i}>
          {formattedContent}
          <br />
        </React.Fragment>
      );
    });
  };

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
                  <p>{renderText(msg.text)}</p>
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

