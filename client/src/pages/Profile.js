import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      const favoriteIds = res.data.user.preferences?.favoriteDevices || [];
      if (favoriteIds.length > 0) {
        const devicesRes = await axios.post('/api/devices/compare', {
          deviceIds: favoriteIds
        });
        setFavorites(devicesRes.data.devices || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (deviceId) => {
    try {
      await axios.delete(`/api/user/favorites/${deviceId}`);
      setFavorites(favorites.filter(f => f._id !== deviceId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user) {
    return <div>Please login to view your profile</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="info-card">
              <div className="info-item">
                <label>Name</label>
                <p>{user.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label>Quiz Status</label>
                <p>{user.quizCompleted ? 'Completed' : 'Not Completed'}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h2>My Favorites</h2>
              <Link to="/recommendations" className="btn btn-secondary">
                View Recommendations
              </Link>
            </div>
            {loading ? (
              <div className="loader"></div>
            ) : favorites.length === 0 ? (
              <div className="empty-state">
                <p>No favorite devices yet. Start exploring and save your favorites!</p>
                <Link to="/devices" className="btn btn-primary">
                  Browse Devices
                </Link>
              </div>
            ) : (
              <div className="favorites-grid">
                {favorites.map(device => (
                  <div key={device._id} className="favorite-card">
                    <Link to={`/devices/${device._id}`}>
                      <img
                        src={device.image || 'https://via.placeholder.com/200'}
                        alt={device.name}
                      />
                      <h3>{device.name}</h3>
                      <p>{device.brand}</p>
                    </Link>
                    <button
                      className="btn-remove"
                      onClick={() => removeFavorite(device._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!user.quizCompleted && (
            <div className="profile-section">
              <div className="quiz-reminder">
                <h2>Complete Your Quiz</h2>
                <p>Take our quick quiz to get personalized device recommendations</p>
                <Link to="/quiz" className="btn btn-primary">
                  Take Quiz
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

