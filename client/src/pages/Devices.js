import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaFilter, FaSearch, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import './Devices.css';

const Devices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'createdAt',
    order: 'desc'
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  // Device Image Mapping
  const getDeviceImage = (device) => {
    const name = device.name.toLowerCase();
    const brand = device.brand.toLowerCase();

    // Specific device mappings
    if (name.includes('iphone 15 pro')) return 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop';
    if (name.includes('iphone 15')) return 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop';
    if (name.includes('iphone 14')) return 'https://images.unsplash.com/photo-1663499482523-1c0c167dd2a7?w=800&auto=format&fit=crop';

    if (name.includes('s24 ultra')) return 'https://images.unsplash.com/photo-1706606991536-e3204238b34e?w=800&auto=format&fit=crop';
    if (name.includes('s24')) return 'https://images.unsplash.com/photo-1706709855523-64433d2d2a48?w=800&auto=format&fit=crop';
    if (name.includes('s23')) return 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800&auto=format&fit=crop';

    if (name.includes('pixel 8 pro')) return 'https://images.unsplash.com/photo-1696321727327-023a7392658a?w=800&auto=format&fit=crop';
    if (name.includes('pixel 8')) return 'https://images.unsplash.com/photo-1698744766863-74e27f0525c2?w=800&auto=format&fit=crop';
    if (name.includes('pixel 7')) return 'https://images.unsplash.com/photo-1665912018805-492723321561?w=800&auto=format&fit=crop';

    if (name.includes('xiaomi 14')) return 'https://images.unsplash.com/photo-1709666099516-793540e53a28?w=800&auto=format&fit=crop';
    if (name.includes('redmi note')) return 'https://images.unsplash.com/photo-1675789659426-3f3603c42878?w=800&auto=format&fit=crop';

    if (name.includes('oneplus 12')) return 'https://images.unsplash.com/photo-1706366579893-684c59299496?w=800&auto=format&fit=crop';

    // Fallback based on brand
    if (brand === 'apple') return 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop';
    if (brand === 'samsung') return 'https://images.unsplash.com/photo-1610945265078-38584e2690e0?w=800&auto=format&fit=crop';
    if (brand === 'google') return 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=800&auto=format&fit=crop';
    if (brand === 'sony') return 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&auto=format&fit=crop';
    if (brand === 'dell') return 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop';
    if (brand === 'hp') return 'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=800&auto=format&fit=crop';

    // Generic fallbacks
    if (device.category === 'laptop') return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop';
    if (device.category === 'tablet') return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop';
    if (device.category === 'smartwatch') return 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop';
    if (device.category === 'headphones') return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop';

    return device.image || 'https://via.placeholder.com/300';
  };

  useEffect(() => {
    fetchBrandsAndCategories();
  }, []);

  // Sync state with URL params
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      search: searchParams.get('search') || ''
    }));
  }, [searchParams]);

  useEffect(() => {
    fetchDevices();
  }, [filters]);

  const fetchBrandsAndCategories = async () => {
    try {
      const [brandsRes, categoriesRes] = await Promise.all([
        axios.get('/api/devices/brands/list'),
        axios.get('/api/devices/categories/list')
      ]);
      setBrands(brandsRes.data.brands);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      // Set limit to 12
      params.append('limit', '12');

      const res = await axios.get(`/api/devices?${params.toString()}`);
      setDevices(res.data.devices || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="devices-page">
      <div className="container">
        <div className="devices-header">
          <h1>Browse Devices</h1>
          <p>Find the perfect device for your needs</p>
        </div>

        <div className={`filters-panel ${showFilters ? 'open' : 'closed'}`}>
          <div className="search-bar-full">
            <FaSearch />
            <input
              type="text"
              placeholder="Search devices..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={`${filters.sort}-${filters.order}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                handleFilterChange('sort', sort);
                handleFilterChange('order', order);
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="averageRating-desc">Highest Rated</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>

          <div className="filter-group">
            <label style={{ visibility: 'hidden' }}>Clear</label>
            <button
              className="btn-clear"
              onClick={() => {
                setFilters({
                  category: '',
                  brand: '',
                  search: '',
                  minPrice: '',
                  maxPrice: '',
                  sort: 'createdAt',
                  order: 'desc'
                });
                setSearchParams({});
              }}
            >
              Clear Filters
            </button>
          </div>
          <button
            className="btn-filter-toggle"
            onClick={() => setShowFilters(false)}
          >
            <FaFilter /> Hide Filters
          </button>
        </div>

        {!showFilters && (
          <button
            className="btn-filter-show"
            onClick={() => setShowFilters(true)}
          >
            <FaFilter /> Show Filters & Search
          </button>
        )}

        {loading ? (
          <div className="loader"></div>
        ) : devices.length === 0 ? (
          <div className="no-results">
            <h3>No devices found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="devices-grid">
            {devices.map(device => (
              <Link key={device._id} to={`/devices/${device._id}`} className="device-card">
                <div className="device-image">
                  <img src={getDeviceImage(device)} alt={device.name} />
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
                  <div className="device-tags">
                    {device.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Devices;

