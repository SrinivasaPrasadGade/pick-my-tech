import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaStar, FaExternalLinkAlt, FaInfoCircle, FaHeart, FaShareAlt } from 'react-icons/fa';
import './DeviceDetail.css';

const DeviceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

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
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    });
  };

  const handleFeatureClick = (feature) => {
    setExpandedFeature(expandedFeature === feature ? null : feature);
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  if (!device) {
    return <div className="no-device">Device not found</div>;
  }

  const specs = device.specifications || {};
  const prices = device.prices || [];

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
            {specs.display && (
              <div className="spec-section">
                <h3>Display</h3>
                <div className="spec-list">
                  {specs.display.size && <SpecItem label="Size" value={specs.display.size} />}
                  {specs.display.resolution && (
                    <SpecItem label="Resolution" value={specs.display.resolution} />
                  )}
                  {specs.display.type && (
                    <SpecItem label="Type" value={specs.display.type} feature="display-type" onFeatureClick={handleFeatureClick} />
                  )}
                  {specs.display.refreshRate && (
                    <SpecItem label="Refresh Rate" value={specs.display.refreshRate} feature="refresh-rate" onFeatureClick={handleFeatureClick} />
                  )}
                </div>
              </div>
            )}

            {specs.processor && (
              <div className="spec-section">
                <h3>Processor</h3>
                <div className="spec-list">
                  {specs.processor.name && (
                    <SpecItem label="Processor" value={specs.processor.name} feature="processor" onFeatureClick={handleFeatureClick} />
                  )}
                  {specs.processor.cores && (
                    <SpecItem label="Cores" value={`${specs.processor.cores} cores`} />
                  )}
                  {specs.processor.speed && (
                    <SpecItem label="Speed" value={specs.processor.speed} />
                  )}
                </div>
              </div>
            )}

            {specs.memory && (
              <div className="spec-section">
                <h3>Memory & Storage</h3>
                <div className="spec-list">
                  {specs.memory.ram && (
                    <SpecItem label="RAM" value={specs.memory.ram} feature="ram" onFeatureClick={handleFeatureClick} />
                  )}
                  {specs.memory.storage && (
                    <SpecItem label="Storage" value={specs.memory.storage} feature="storage" onFeatureClick={handleFeatureClick} />
                  )}
                </div>
              </div>
            )}

            {specs.camera && (
              <div className="spec-section">
                <h3>Camera</h3>
                <div className="spec-list">
                  {specs.camera.rear && (
                    <SpecItem label="Rear Camera" value={specs.camera.rear} feature="camera" onFeatureClick={handleFeatureClick} />
                  )}
                  {specs.camera.front && (
                    <SpecItem label="Front Camera" value={specs.camera.front} />
                  )}
                  {specs.camera.video && (
                    <SpecItem label="Video" value={specs.camera.video} />
                  )}
                </div>
              </div>
            )}

            {specs.battery && (
              <div className="spec-section">
                <h3>Battery</h3>
                <div className="spec-list">
                  {specs.battery.capacity && (
                    <SpecItem label="Capacity" value={specs.battery.capacity} feature="battery" onFeatureClick={handleFeatureClick} />
                  )}
                  {specs.battery.fastCharge && (
                    <SpecItem label="Fast Charge" value={specs.battery.fastCharge ? 'Yes' : 'No'} />
                  )}
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

        <div className="feature-explanations">
          <h2>Understanding Specifications</h2>
          <p className="explanation-intro">
            Not sure what a feature means? Click on any spec with an info icon to learn more.
          </p>
          {expandedFeature && (
            <div className="explanation-box">
              <FeatureExplanation feature={expandedFeature} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SpecItem = ({ label, value, feature, onFeatureClick }) => {
  return (
    <div className="spec-item">
      <span className="spec-label">{label}:</span>
      <span className="spec-value">
        {value}
        {feature && (
          <FaInfoCircle
            className="info-icon"
            onClick={(e) => {
              e.stopPropagation();
              onFeatureClick(feature);
            }}
            title="Click for more information"
          />
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
    <div>
      <h3>{explanation.title}</h3>
      <p>{explanation.description}</p>
      <a href={explanation.link} target="_blank" rel="noopener noreferrer">
        Learn more <FaExternalLinkAlt />
      </a>
    </div>
  );
};

export default DeviceDetail;

