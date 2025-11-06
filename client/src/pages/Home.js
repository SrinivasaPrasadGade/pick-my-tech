import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaArrowRight, FaMobileAlt, FaLaptop, FaTabletAlt, FaStar } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [featuredDevices, setFeaturedDevices] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [devicesRes, newsRes] = await Promise.all([
        axios.get('/api/devices?limit=6&sort=averageRating&order=desc'),
        axios.get('/api/news?limit=3&featured=true')
      ]);
      setFeaturedDevices(devicesRes.data.devices || []);
      setLatestNews(newsRes.data.news || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Mobile Phones', icon: FaMobileAlt, link: '/devices?category=mobile', color: '#0071e3' },
    { name: 'Laptops', icon: FaLaptop, link: '/devices?category=laptop', color: '#5856d6' },
    { name: 'Tablets', icon: FaTabletAlt, link: '/devices?category=tablet', color: '#af52de' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1 className="hero-title">
            Find Your Perfect
            <span className="gradient-text"> Tech Device</span>
          </h1>
          <p className="hero-subtitle">
            Discover the ideal mobile phones, laptops, and gadgets tailored to your needs.
            Powered by intelligent recommendations.
          </p>
          <div className="hero-buttons">
            <Link to="/devices" className="btn btn-primary btn-large">
              Explore Devices
              <FaArrowRight />
            </Link>
            <Link to="/recommendations" className="btn btn-secondary btn-large">
              Get Recommendations
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-image"
        >
          <div className="hero-image-placeholder">
            <FaMobileAlt size={120} />
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={category.link} className="category-card">
                  <div className="category-icon" style={{ background: `${category.color}20`, color: category.color }}>
                    <category.icon size={48} />
                  </div>
                  <h3>{category.name}</h3>
                  <p>Explore the latest {category.name.toLowerCase()}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Devices */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Devices</h2>
            <Link to="/devices" className="view-all">
              View All <FaArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <div className="devices-grid">
              {featuredDevices.map((device, index) => (
                <motion.div
                  key={device._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/devices/${device._id}`} className="device-card">
                    <div className="device-image">
                      <img src={device.image || 'https://via.placeholder.com/300'} alt={device.name} />
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
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tech News */}
      <section className="section news-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Tech News</h2>
            <Link to="/news" className="view-all">
              View All <FaArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <div className="news-grid">
              {latestNews.map((news, index) => (
                <motion.div
                  key={news._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/news/${news._id}`} className="news-card">
                    <div className="news-image">
                      <img src={news.imageUrl || 'https://via.placeholder.com/400'} alt={news.title} />
                    </div>
                    <div className="news-content">
                      <span className="news-category">{news.category}</span>
                      <h3>{news.title}</h3>
                      <p>{news.description}</p>
                      <span className="news-date">
                        {new Date(news.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="cta-content"
          >
            <h2>Ready to Find Your Perfect Device?</h2>
            <p>Take our quick quiz and get personalized recommendations</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

