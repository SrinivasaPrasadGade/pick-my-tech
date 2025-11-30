import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSearch } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">PickMyTech</span>
        </Link>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/devices" className={isActive('/devices')} onClick={() => setMobileMenuOpen(false)}>
              Devices
            </Link>
          </li>
          <li>
            <Link to="/news" className={isActive('/news')} onClick={() => setMobileMenuOpen(false)}>
              Tech News
            </Link>
          </li>
          <li>
            <Link to="/community" className={isActive('/community')} onClick={() => setMobileMenuOpen(false)}>
              Community
            </Link>
          </li>
          <li>
            <Link to="/compare" className={isActive('/compare')} onClick={() => setMobileMenuOpen(false)}>
              Compare
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/recommendations" className={isActive('/recommendations')} onClick={() => setMobileMenuOpen(false)}>
                  Recommendations
                </Link>
              </li>
              <li>
                <Link to="/profile" className={isActive('/profile')} onClick={() => setMobileMenuOpen(false)}>
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
                <Link to="/login" className={isActive('/login')} onClick={() => setMobileMenuOpen(false)}>
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

