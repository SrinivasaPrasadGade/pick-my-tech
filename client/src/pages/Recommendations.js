import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import './Recommendations.css';

const Recommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.post('/api/recommendations');
      setRecommendations(res.data.recommendations || []);
      setScores(res.data.scores || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      if (error.response?.status === 400) {
        // User hasn't completed quiz
        alert('Please complete the quiz first to get recommendations!');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMatchPercentage = (score) => {
    return Math.min(100, Math.round(score));
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="recommendations-page">
      <div className="container">
        <div className="recommendations-header">
          <h1>Your Personalized Recommendations</h1>
          <p>Based on your preferences and requirements</p>
        </div>

        {recommendations.length === 0 ? (
          <div className="no-recommendations">
            <p>No recommendations available. Please complete the quiz first.</p>
            <Link to="/quiz" className="btn btn-primary">
              Take Quiz
            </Link>
          </div>
        ) : (
          <div className="recommendations-grid">
            {recommendations.map((device, index) => {
              const matchScore = scores[index]?.score || 0;
              const matchPercentage = getMatchPercentage(matchScore);

              return (
                <div key={device._id} className="recommendation-card">
                  <div className="match-badge">
                    {matchPercentage}% Match
                  </div>
                  <Link to={`/devices/${device._id}`}>
                    <div className="device-image">
                      <img
                        src={device.image || 'https://via.placeholder.com/300'}
                        alt={device.name}
                      />
                    </div>
                    <div className="device-info">
                      <h3>{device.name}</h3>
                      <p className="device-brand">{device.brand}</p>
                      {device.averageRating > 0 && (
                        <div className="device-rating">
                          <FaStar color="#ffc107" />
                          <span>{device.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                      {device.prices && device.prices.length > 0 && (
                        <p className="device-price">
                          From ${Math.min(...device.prices.map(p => p.price)).toLocaleString()}
                        </p>
                      )}
                      <div className="recommendation-reasons">
                        <h4>Why this device?</h4>
                        <ul>
                          {scores[index]?.reasons?.length > 0 ? (
                            scores[index].reasons.map((reason, i) => (
                              <li key={i}>{reason}</li>
                            ))
                          ) : (
                            <li>Matches your preferences</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Link>
                  <div className="recommendation-actions">
                    <Link
                      to={`/devices/${device._id}`}
                      className="btn btn-primary btn-full"
                    >
                      View Details <FaArrowRight />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;

