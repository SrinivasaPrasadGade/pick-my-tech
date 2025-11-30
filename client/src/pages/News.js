import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchNews();
  }, [category]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = category ? `?category=${category}` : '';
      const res = await axios.get(`/api/news${params}`);
      setNews(res.data.news || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['', 'mobile', 'laptop', 'tablet', 'smartwatch', 'general', 'reviews', 'rumors'];

  return (
    <div className="news-page">
      <div className="container">
        <div className="news-header">
          <h1>Tech News</h1>
          <p>Stay updated with the latest technology news and trends</p>
        </div>

        <div className="news-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="news-grid">
            {news.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="news-card-large">
                  <div className="news-image-large">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800';
                      }}
                    />
                    {item.featured && <span className="featured-badge">Featured</span>}
                  </div>
                  <div className="news-content-large">
                    <span className="news-category">{item.category}</span>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <div className="news-meta">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      {item.views > 0 && (
                        <>
                          <span>•</span>
                          <span>{item.views} views</span>
                        </>
                      )}
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && news.length === 0 && (
          <div className="no-news">
            <p>No news articles found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;

