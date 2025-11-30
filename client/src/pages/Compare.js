import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaTimes, FaSearch, FaCheck } from 'react-icons/fa';
import './Compare.css';

const Compare = () => {
    const [selectedDevices, setSelectedDevices] = useState([null, null, null]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeSlot, setActiveSlot] = useState(null);
    const [loading, setLoading] = useState(false);

    // Search for devices when query changes
    useEffect(() => {
        const searchDevices = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }

            try {
                let url = `/api/devices?search=${encodeURIComponent(searchQuery)}`;

                // If the first device is selected, filter subsequent searches by its category
                if (selectedDevices[0] && selectedDevices[0].category) {
                    url += `&category=${encodeURIComponent(selectedDevices[0].category)}`;
                }

                const res = await axios.get(url);
                setSearchResults(res.data.devices.slice(0, 5));
            } catch (error) {
                console.error('Error searching devices:', error);
            }
        };

        const timeoutId = setTimeout(searchDevices, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleDeviceSelect = (device) => {
        const newSelected = [...selectedDevices];
        newSelected[activeSlot] = device;
        setSelectedDevices(newSelected);
        setActiveSlot(null);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleRemoveDevice = (index) => {
        const newSelected = [...selectedDevices];
        newSelected[index] = null;
        setSelectedDevices(newSelected);
    };

    const openSearch = (index) => {
        setActiveSlot(index);
        setSearchQuery('');
        setSearchResults([]);
    };

    const formatSpec = (device, category, field) => {
        if (!device || !device.specifications || !device.specifications[category]) return '-';
        const value = device.specifications[category][field];
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        return value || '-';
    };

    const getPrice = (device) => {
        if (!device || !device.prices || device.prices.length === 0) return 'N/A';
        return `$${Math.min(...device.prices.map(p => p.price)).toLocaleString()}`;
    };

    return (
        <div className="compare-page">
            <div className="container">
                <div className="compare-header">
                    <h1>Compare Devices</h1>
                    <p>Select up to 3 devices to see how they stack up.</p>
                </div>

                {/* Device Selection Header - Sticky */}
                <div className="compare-grid-header">
                    <div className="spec-label-col"></div>
                    {selectedDevices.map((device, index) => (
                        <div key={index} className="device-col">
                            {device ? (
                                <div className="selected-device-card">
                                    <button
                                        className="btn-remove"
                                        onClick={() => handleRemoveDevice(index)}
                                    >
                                        <FaTimes />
                                    </button>
                                    <img src={device.image || 'https://via.placeholder.com/150'} alt={device.name} />
                                    <h3>{device.name}</h3>
                                    <p className="device-price">{getPrice(device)}</p>
                                    <Link to={`/devices/${device._id}`} className="view-details-link">
                                        View Details
                                    </Link>
                                </div>
                            ) : (
                                <div className="empty-slot">
                                    {activeSlot === index ? (
                                        <div className="device-search-dropdown">
                                            <div className="search-input-wrapper">
                                                <FaSearch />
                                                <input
                                                    type="text"
                                                    placeholder="Type to search..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    autoFocus
                                                />
                                                <button onClick={() => setActiveSlot(null)}><FaTimes /></button>
                                            </div>
                                            <div className="search-results">
                                                {searchResults.map(result => (
                                                    <div
                                                        key={result._id}
                                                        className="search-result-item"
                                                        onClick={() => handleDeviceSelect(result)}
                                                    >
                                                        <img src={result.image} alt={result.name} />
                                                        <span>{result.name}</span>
                                                    </div>
                                                ))}
                                                {searchQuery.length > 1 && searchResults.length === 0 && (
                                                    <div className="no-results">No devices found</div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn-add-device"
                                            onClick={() => openSearch(index)}
                                        >
                                            <div className="plus-icon"><FaPlus /></div>
                                            <span>Add Device</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Comparison Sections */}
                <div className="compare-sections">
                    {/* Summary */}
                    <div className="compare-section">
                        <h2>Summary</h2>
                        <div className="spec-row">
                            <div className="spec-label">Brand</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{device?.brand || '-'}</div>
                            ))}
                        </div>
                        <div className="spec-row">
                            <div className="spec-label">Release Date</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">
                                    {device?.releaseDate ? new Date(device.releaseDate).toLocaleDateString() : '-'}
                                </div>
                            ))}
                        </div>
                        <div className="spec-row">
                            <div className="spec-label">Category</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value" style={{ textTransform: 'capitalize' }}>
                                    {device?.category || '-'}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Display */}
                    <div className="compare-section">
                        <h2>Display</h2>
                        <div className="spec-row">
                            <div className="spec-label">Size</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'display', 'size')}</div>
                            ))}
                        </div>
                        <div className="spec-row">
                            <div className="spec-label">Resolution</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'display', 'resolution')}</div>
                            ))}
                        </div>
                        <div className="spec-row">
                            <div className="spec-label">Type</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'display', 'type')}</div>
                            ))}
                        </div>
                        <div className="spec-row">
                            <div className="spec-label">Refresh Rate</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'display', 'refreshRate')}</div>
                            ))}
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="compare-section">
                        <h2>Performance</h2>
                        <div className="spec-row">
                            <div className="spec-label">Processor</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'processor', 'name')}</div>
                            ))}
                        </div>
                        <div className="spec-row">
                            <div className="spec-label">RAM</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'memory', 'ram')}</div>
                            ))}
                        </div>
                        <div className="spec-row">
                            <div className="spec-label">Storage</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'memory', 'storage')}</div>
                            ))}
                        </div>
                    </div>

                    {/* Camera */}
                    <div className="compare-section">
                        <h2>Camera</h2>
                        <div className="spec-row">
                            <div className="spec-label">Rear Camera</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'camera', 'rear')}</div>
                            ))}
                        </div>
                        <div className="spec-row">
                            <div className="spec-label">Front Camera</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'camera', 'front')}</div>
                            ))}
                        </div>
                        <div className="spec-row">
                            <div className="spec-label">Video</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'camera', 'video')}</div>
                            ))}
                        </div>
                    </div>

                    {/* Battery */}
                    <div className="compare-section">
                        <h2>Battery</h2>
                        <div className="spec-row">
                            <div className="spec-label">Capacity</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">{formatSpec(device, 'battery', 'capacity')}</div>
                            ))}
                        </div>
                        <div className="spec-row">
                            <div className="spec-label">Fast Charging</div>
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="spec-value">
                                    {device?.specifications?.battery?.fastCharge ? <FaCheck color="green" /> : '-'}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compare;
