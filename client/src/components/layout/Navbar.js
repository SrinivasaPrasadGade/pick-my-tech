import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSearch } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/devices?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">PickMyTech</span>
        </Link>

        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </form>
        </div>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/devices" onClick={() => setMobileMenuOpen(false)}>
              Devices
            </Link>
          </li>
          <li>
            <Link to="/news" onClick={() => setMobileMenuOpen(false)}>
              Tech News
            </Link>
          </li>
          <li>
            <Link to="/community" onClick={() => setMobileMenuOpen(false)}>
              Community
            </Link>
          </li>
          <li>
            <Link to="/compare" onClick={() => setMobileMenuOpen(false)}>
              Compare
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/recommendations" onClick={() => setMobileMenuOpen(false)}>
                  Recommendations
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <FaUser /> {user.name}
                </Link>
              </li>
              <li>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-signup">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

