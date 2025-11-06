import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Devices from './pages/Devices';
import DeviceDetail from './pages/DeviceDetail';
import News from './pages/News';
import Community from './pages/Community';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import Chatbot from './components/chatbot/Chatbot';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/devices/:id" element={<DeviceDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/community" element={<Community />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <Register />} 
        />
        <Route 
          path="/quiz" 
          element={user && (!user.quizCompleted || user.quizCompleted === false) ? <Quiz /> : <Navigate to="/" />} 
        />
        <Route 
          path="/recommendations" 
          element={user ? <Recommendations /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/login" />} 
        />
      </Routes>
      <Chatbot />
    </div>
  );
}

export default App;
