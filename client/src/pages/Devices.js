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

  useEffect(() => {
    fetchBrandsAndCategories();
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
      const res = await axios.get(`/api/devices?${params.toString()}`);
      setDevices(res.data.devices || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    const newParams = new URLSearchParams();
    Object.keys({ ...filters, [key]: value }).forEach(k => {
      if (filters[k] || (k === key && value)) {
        newParams.append(k, filters[k] || (k === key ? value : ''));
      }
    });
    setSearchParams(newParams);
  };

  return (
    <div className="devices-page">
      <div className="container">
        <div className="devices-header">
          <h1>Browse Devices</h1>
          <p>Find the perfect device for your needs</p>
        </div>

        {showFilters && (
          <div className="filters-panel">
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
        )}

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

