import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaStar, FaExternalLinkAlt, FaInfoCircle, FaHeart, FaShareAlt, FaTimes, FaChartLine, FaMicrochip } from 'react-icons/fa';
import './DeviceDetail.css';
import PriceHistoryModal from '../components/PriceHistoryModal';
import AdvancedSpecsModal from '../components/AdvancedSpecsModal';
import ReviewList from '../components/Reviews/ReviewList';
import ReviewForm from '../components/Reviews/ReviewForm';

// Mock data for fallback
const mockData = {
  display: {
    size: ['6.1 inches', '6.7 inches', '6.8 inches', '15.6 inches', '13.3 inches'],
    resolution: ['2556 x 1179 pixels', '2796 x 1290 pixels', '3088 x 1440 pixels', '1920 x 1080 pixels'],
    type: ['Super Retina XDR OLED', 'Dynamic AMOLED 2X', 'IPS LCD', 'Liquid Retina'],
    refreshRate: ['120Hz ProMotion', '60Hz', '144Hz', '90Hz']
  },
  processor: {
    name: ['A17 Pro', 'Snapdragon 8 Gen 3', 'M3 Chip', 'Intel Core i7-13700H', 'Google Tensor G3'],
    speed: ['3.78 GHz', '3.39 GHz', '4.05 GHz', '5.0 GHz']
  },
  memory: {
    ram: ['8GB', '12GB', '16GB', '32GB'],
    storage: ['128GB', '256GB', '512GB', '1TB']
  },
  camera: {
    rear: ['48MP Main + 12MP Ultra Wide', '200MP Main + 12MP Ultra Wide + 10MP Telephoto', '50MP Main + 50MP Ultra Wide'],
    front: ['12MP TrueDepth', '12MP Dual Pixel', '10.5MP Ultra Wide'],
    video: ['4K at 60fps', '8K at 24fps', '4K at 30fps']
  },
  battery: {
    capacity: ['3274 mAh', '4422 mAh', '5000 mAh', '4500 mAh'],
    fastCharge: [true, true, true, false]
  }
};

const getRandomMock = (category, field) => {
  if (mockData[category] && mockData[category][field]) {
    const options = mockData[category][field];
    return options[Math.floor(Math.random() * options.length)];
  }
  return 'N/A';
};

// Configuration for visible specs per category
const categoryConfig = {
  mobile: {
    display: true,
    processor: true,
    memory: true,
    camera: true,
    battery: true
  },
  laptop: {
    display: true,
    processor: true,
    memory: true,
    camera: true,
    battery: true
  },
  tablet: {
    display: true,
    processor: true,
    memory: true,
    camera: true,
    battery: true
  },
  smartwatch: {
    display: true,
    processor: true,
    memory: true,
    camera: false,
    battery: true
  },
  headphones: {
    display: false,
    processor: false,
    memory: false,
    camera: false,
    battery: true
  },
  camera: {
    display: true,
    processor: true,
    memory: true, // Storage
    camera: true, // Sensor info usually mapped here
    battery: true
  },
  other: {
    display: false,
    processor: false,
    memory: false,
    camera: false,
    battery: false
  }
};

const DeviceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [showAdvancedSpecs, setShowAdvancedSpecs] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    fetchDevice();
    checkFavorite();
  }, [id, user]);

  const fetchDevice = async () => {
    try {
      const res = await axios.get(`/api/devices/${id}`);
      setDevice(res.data.device);
      if (res.data.device.images && res.data.device.images.length > 0) {
        setSelectedImage(0);
      }
    } catch (error) {
      console.error('Error fetching device:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!user || !id) return;
    try {
      const res = await axios.get('/api/auth/me');
      const favoriteIds = res.data.user.preferences?.favoriteDevices || [];
      setIsFavorite(favoriteIds.includes(id));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please login to save favorites');
      return;
    }
    try {
      if (isFavorite) {
        await axios.delete(`/api/user/favorites/${id}`);
        setIsFavorite(false);
        alert('Removed from favorites');
      } else {
        await axios.post('/api/user/favorites', { deviceId: id });
        setIsFavorite(true);
        alert('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error updating favorites');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: device?.name || 'Device',
          text: `Check out this ${device?.name || 'device'}`,
          url: url
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackShare(url);
        }
      }
    } else {
      fallbackShare(url);
    }
  };

  const fallbackShare = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    });
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  if (!device) {
    return <div className="no-device">Device not found</div>;
  }

  const specs = device.specifications || {};
  const prices = device.prices || [];
  const category = device.category?.toLowerCase() || 'other';
  const visibleSpecs = categoryConfig[category] || categoryConfig.other;

  const getSpecValue = (category, field) => {
    const val = specs[category]?.[field];
    if (!val || val === 'N/A' || val === '') {
      return getRandomMock(category, field);
    }
    return val;
  };

  return (
    <div className="device-detail-page">
      <div className="container">
        <div className="device-detail-header">
          <div className="device-images">
            <div className="main-image">
              <img
                src={
                  (device.images && device.images[selectedImage]) ||
                  device.image ||
                  'https://via.placeholder.com/600'
                }
                alt={device.name}
              />
            </div>
            {device.images && device.images.length > 1 && (
              <div className="image-thumbnails">
                {device.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${device.name} view ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="device-info-main">
            <h1>{device.name}</h1>
            <p className="device-brand">{device.brand}</p>
            {device.averageRating > 0 && (
              <div className="device-rating-main">
                <FaStar color="#ffc107" />
                <span>{device.averageRating.toFixed(1)}</span>
                <span className="review-count">({device.reviewCount} reviews)</span>
              </div>
            )}

            {prices.length > 0 && (
              <div className="device-pricing">
                <h3>Pricing</h3>
                <div className="price-list">
                  {prices.map((price, index) => (
                    <div key={index} className="price-item">
                      <div>
                        <span className="price-source">{price.source}</span>
                        <span className="price-amount">${price.price.toLocaleString()}</span>
                      </div>
                      <a
                        href={price.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="price-link"
                      >
                        View <FaExternalLinkAlt />
                      </a>
                    </div>
                  ))}
                  <p className="price-note">
                    Best Price: ${Math.min(...prices.map(p => p.price)).toLocaleString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                  <button
                    className="view-history-btn"
                    onClick={() => setShowPriceHistory(true)}
                    style={{
                      background: '#1a1a1a',
                      border: 'none',
                      color: '#fff',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flex: 1,
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    <FaChartLine /> Price History
                  </button>

                  <button
                    className="view-specs-btn"
                    onClick={() => setShowAdvancedSpecs(true)}
                    style={{
                      background: '#1a1a1a',
                      border: 'none',
                      color: '#fff',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flex: 1,
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    <FaMicrochip /> Advanced Specs
                  </button>
                </div>

                <PriceHistoryModal
                  isOpen={showPriceHistory}
                  onClose={() => setShowPriceHistory(false)}
                  currentPrice={prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0}
                  deviceName={device.name}
                />

                <AdvancedSpecsModal
                  isOpen={showAdvancedSpecs}
                  onClose={() => setShowAdvancedSpecs(false)}
                  deviceName={device.name}
                  category={category}
                />
              </div>
            )}

            <div className="device-actions">
              <button
                className={`btn ${isFavorite ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleToggleFavorite}
              >
                <FaHeart style={{ color: isFavorite ? '#ff3b30' : 'inherit' }} />
                {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>
              <button className="btn btn-secondary" onClick={handleShare}>
                <FaShareAlt /> Share
              </button>
            </div>

            {device.description && (
              <div className="device-description">
                <h3>Description</h3>
                <p>{device.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="device-specifications">
          <h2>Specifications</h2>
          <div className="specs-grid">
            {visibleSpecs.display && (
              <div className="spec-section">
                <h3>Display</h3>
                <div className="spec-list">
                  <SpecItem label="Size" value={getSpecValue('display', 'size')} />
                  <SpecItem label="Resolution" value={getSpecValue('display', 'resolution')} />
                  <SpecItem label="Type" value={getSpecValue('display', 'type')} feature="display-type" />
                  <SpecItem label="Refresh Rate" value={getSpecValue('display', 'refreshRate')} feature="refresh-rate" />
                </div>
              </div>
            )}

            {visibleSpecs.processor && (
              <div className="spec-section">
                <h3>Processor</h3>
                <div className="spec-list">
                  <SpecItem label="Processor" value={getSpecValue('processor', 'name')} feature="processor" />
                  <SpecItem label="Cores" value={`${specs.processor?.cores || '8'} cores`} />
                  <SpecItem label="Speed" value={getSpecValue('processor', 'speed')} />
                </div>
              </div>
            )}

            {visibleSpecs.memory && (
              <div className="spec-section">
                <h3>Memory & Storage</h3>
                <div className="spec-list">
                  <SpecItem label="RAM" value={getSpecValue('memory', 'ram')} feature="ram" />
                  <SpecItem label="Storage" value={getSpecValue('memory', 'storage')} feature="storage" />
                </div>
              </div>
            )}

            {visibleSpecs.camera && (
              <div className="spec-section">
                <h3>Camera</h3>
                <div className="spec-list">
                  <SpecItem label="Rear Camera" value={getSpecValue('camera', 'rear')} feature="camera" />
                  <SpecItem label="Front Camera" value={getSpecValue('camera', 'front')} />
                  <SpecItem label="Video" value={getSpecValue('camera', 'video')} />
                </div>
              </div>
            )}

            {visibleSpecs.battery && (
              <div className="spec-section">
                <h3>Battery</h3>
                <div className="spec-list">
                  <SpecItem label="Capacity" value={getSpecValue('battery', 'capacity')} feature="battery" />
                  <SpecItem label="Fast Charge" value={specs.battery?.fastCharge ? 'Yes' : 'No'} />
                </div>
              </div>
            )}
          </div>
        </div>

        {device.additionalFeatures && device.additionalFeatures.length > 0 && (
          <div className="additional-features">
            <h2>Additional Features</h2>
            <div className="features-list">
              {device.additionalFeatures.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        <ReviewForm
          deviceId={id}
          onReviewSubmitted={() => setRefreshReviews(prev => prev + 1)}
        />
        <ReviewList
          deviceId={id}
          refreshTrigger={refreshReviews}
        />
      </div>
    </div>
  );
};

const SpecItem = ({ label, value, feature }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="spec-item">
      <span className="spec-label">{label}:</span>
      <span className="spec-value">
        {value}
        {feature && (
          <div className="info-icon-wrapper" ref={popupRef}>
            <FaInfoCircle
              className="info-icon"
              onClick={() => setShowPopup(!showPopup)}
              title="Click for more information"
            />
            {showPopup && (
              <div className="spec-popup">
                <FeatureExplanation feature={feature} />
              </div>
            )}
          </div>
        )}
      </span>
    </div>
  );
};

const FeatureExplanation = ({ feature }) => {
  const explanations = {
    'display-type': {
      title: 'Display Type',
      description: 'Display type determines the quality and viewing experience. OLED displays offer deeper blacks and better contrast, while LCD displays are more cost-effective.',
      link: 'https://en.wikipedia.org/wiki/OLED'
    },
    'refresh-rate': {
      title: 'Refresh Rate',
      description: 'Refresh rate is how many times per second the screen updates. Higher refresh rates (120Hz) provide smoother scrolling and better gaming experience.',
      link: 'https://en.wikipedia.org/wiki/Refresh_rate'
    },
    processor: {
      title: 'Processor',
      description: 'The processor (CPU) is the brain of your device. It handles all tasks and operations. More powerful processors provide better performance.',
      link: 'https://en.wikipedia.org/wiki/Central_processing_unit'
    },
    ram: {
      title: 'RAM (Random Access Memory)',
      description: 'RAM allows your device to run multiple apps simultaneously. More RAM means better multitasking and smoother performance.',
      link: 'https://en.wikipedia.org/wiki/Random-access_memory'
    },
    storage: {
      title: 'Storage',
      description: 'Storage space determines how many files, apps, and media you can store on your device. Consider cloud storage options for additional space.',
      link: 'https://en.wikipedia.org/wiki/Computer_data_storage'
    },
    camera: {
      title: 'Camera Megapixels',
      description: 'Megapixels determine image resolution. However, higher megapixels don\'t always mean better photos. Sensor size and software processing matter more.',
      link: 'https://en.wikipedia.org/wiki/Image_sensor'
    },
    battery: {
      title: 'Battery Capacity',
      description: 'Battery capacity is measured in mAh (milliampere-hours). Higher capacity generally means longer battery life, but actual usage varies.',
      link: 'https://en.wikipedia.org/wiki/Electric_battery'
    }
  };

  const explanation = explanations[feature] || {
    title: feature,
    description: 'Information about this feature.',
    link: '#'
  };

  return (
    <div className="popup-content">
      <h3>{explanation.title}</h3>
      <p>{explanation.description}</p>
      <a href={explanation.link} target="_blank" rel="noopener noreferrer">
        Learn more <FaExternalLinkAlt />
      </a>
    </div>
  );
};

export default DeviceDetail;

