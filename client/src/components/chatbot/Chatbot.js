import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRobot, FaTimes, FaPaperPlane, FaBolt, FaChevronRight } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! 👋 I'm Maverick. I can help you find devices, compare specs, or answer tech questions. Try asking 'Show me gaming phones under 30k'!",
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

  const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const textToSend = textOverride || input;

    if (!textToSend.trim() || loading) return;

    const userMessage = {
      type: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chatbot', { message: textToSend });
      const { action, response, data, suggestions } = res.data;

      const botResponse = {
        type: 'bot',
        text: response,
        action,
        data,
        suggestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

      // Handle Auto-Navigation
      if (action === 'navigate' && data?.path) {
        // Add a small delay so user can read the message
        setTimeout(() => {
          navigate(data.path);
        }, 1500);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: "Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion === 'View Full Details' && messages[messages.length - 1].data?.deviceId) {
      navigate(`/devices/${messages[messages.length - 1].data.deviceId}`);
      return;
    }
    handleSend(null, suggestion);
  };

  const renderContent = (msg) => {
    // 1. Text Content with Markdown-like formatting
    const formattedText = msg.text.split('\n').map((line, i) => {
      // Bold text
      const parts = line.split(/(\*\*.*?\*\*)/);
      return (
        <div key={i} className="message-line">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </div>
      );
    });

    // 2. Device Cards (Carousel)
    let deviceCards = null;
    if (msg.action === 'render_devices' && msg.data && Array.isArray(msg.data)) {
      deviceCards = (
        <div className="device-carousel">
          {msg.data.map((device) => (
            <div
              key={device._id}
              className="chat-device-card"
              onClick={() => navigate(`/devices/${device._id}`)}
            >
              <div className="chat-device-image">
                <img src={device.image || 'https://via.placeholder.com/100'} alt={device.name} />
              </div>
              <div className="chat-device-info">
                <h4>{device.brand} {device.name}</h4>
                <p className="price">
                  {device.prices?.[0]?.price ? `₹${device.prices[0].price}` : 'N/A'}
                </p>
                <div className="rating">
                  <span>⭐ {device.averageRating || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="message-content-wrapper">
        <div className="text-content">{formattedText}</div>
        {deviceCards}
        {msg.suggestions && (
          <div className="chat-suggestions">
            {msg.suggestions.map((s, idx) => (
              <button key={idx} onClick={() => handleSuggestionClick(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <div className="toggle-icon">
            <FaRobot />
          </div>
          <span className="toggle-text">Chat with Maverick</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="header-info">
              <div className="avatar">
                <FaRobot />
              </div>
              <div>
                <h3>Maverick</h3>
                <p>AI Tech Assistant</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === 'bot' && (
                  <div className="bot-avatar-small">
                    <FaRobot />
                  </div>
                )}
                <div className="message-bubble">
                  {renderContent(msg)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="bot-avatar-small">
                  <FaRobot />
                </div>
                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about phones, laptops..."
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
