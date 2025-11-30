import React, { useEffect, useState } from 'react';
import { FaMicrochip, FaThermometerHalf, FaCamera, FaBatteryBolt, FaTimes, FaBolt } from 'react-icons/fa6';
import './AdvancedSpecsModal.css';

const AdvancedSpecsModal = ({ isOpen, onClose, deviceName }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Trigger animations slightly after open
            setTimeout(() => setAnimate(true), 100);
        } else {
            setAnimate(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Mock Data Generators
    const getMockPerf = () => Math.floor(Math.random() * (98 - 85) + 85);
    const getMockTemp = () => Math.floor(Math.random() * (45 - 35) + 35);

    return (
        <div className="advanced-specs-overlay" onClick={onClose}>
            <div className="advanced-specs-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2><FaMicrochip /> OVERKILL MODE_</h2>
                    <button className="close-btn" onClick={onClose}><FaTimes /></button>
                </div>

                <div className="modal-content">
                    {/* Thermal Throttling */}
                    <div className="spec-card">
                        <h3><FaThermometerHalf /> Thermal Throttling Curve</h3>
                        <div className="chart-container">
                            <svg className="thermal-graph" viewBox="0 0 100 50" preserveAspectRatio="none">
                                <path
                                    d="M0,50 L0,10 L10,12 L20,15 L30,14 L40,20 L50,25 L60,24 L70,30 L80,32 L90,35 L100,38 L100,50 Z"
                                    fill="url(#grad1)"
                                    stroke="#ff3b30"
                                    strokeWidth="0.5"
                                />
                                <defs>
                                    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: 'rgba(255, 59, 48, 0.5)', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: 'rgba(255, 59, 48, 0)', stopOpacity: 0 }} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div style={{ position: 'absolute', top: 10, right: 10, color: '#ff3b30', fontSize: '0.8rem' }}>
                                -15% after 20min
                            </div>
                        </div>
                    </div>

                    {/* Sustained Performance */}
                    <div className="spec-card">
                        <h3><FaBolt /> Sustained Performance</h3>
                        <div className="perf-bar-container">
                            <div className="perf-item">
                                <div className="perf-label">
                                    <span>Peak Performance</span>
                                    <span>100%</span>
                                </div>
                                <div className="perf-bar-bg">
                                    <div className="perf-bar-fill" style={{ width: animate ? '100%' : '0%' }}></div>
                                </div>
                            </div>
                            <div className="perf-item">
                                <div className="perf-label">
                                    <span>Sustained (30 min)</span>
                                    <span>{getMockPerf()}%</span>
                                </div>
                                <div className="perf-bar-bg">
                                    <div className="perf-bar-fill" style={{ width: animate ? `${getMockPerf()}%` : '0%', background: '#ffcc00' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ISO Performance */}
                    <div className="spec-card">
                        <h3><FaCamera /> ISO Performance</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px' }}>
                            {[100, 200, 400, 800, 1600, 3200, 6400].map((iso, i) => (
                                <div key={iso} style={{
                                    width: '12%',
                                    height: `${Math.max(10, 100 - (i * 12))}%`,
                                    background: '#00ff88',
                                    opacity: 0.5 + (i * 0.05),
                                    borderRadius: '4px 4px 0 0',
                                    position: 'relative'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '-25px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '0.6rem',
                                        color: '#888'
                                    }}>{iso}</span>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: '30px', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
                            Signal-to-Noise Ratio (Higher is better)
                        </p>
                    </div>

                    {/* Sensor Size */}
                    <div className="spec-card">
                        <h3><FaCamera /> Sensor Size</h3>
                        <div className="sensor-visual">
                            <div className="sensor-rect" style={{ width: '60%', height: '45%' }}>
                                1/1.3"
                            </div>
                            <div className="sensor-rect" style={{ width: '90%', height: '65%', position: 'absolute', borderStyle: 'dashed', opacity: 0.3 }}>
                                1" (Ref)
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <span className="big-stat">72<span className="stat-unit">mm²</span></span>
                        </div>
                    </div>

                    {/* CPU Perf/Watt */}
                    <div className="spec-card">
                        <h3><FaMicrochip /> CPU Perf / Watt</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px' }}>
                            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                    <path className="circle-bg"
                                        d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#333"
                                        strokeWidth="3"
                                    />
                                    <path className="circle"
                                        strokeDasharray={`${animate ? 85 : 0}, 100`}
                                        d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#00ff88"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                                    />
                                </svg>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>High</div>
                                    <div style={{ fontSize: '0.7rem', color: '#888' }}>Efficiency</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Endurance */}
                    <div className="spec-card">
                        <h3><FaBatteryBolt /> Endurance Rating</h3>
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <span className="big-stat">118<span className="stat-unit">h</span></span>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>Mixed Usage</p>
                        </div>
                        <div className="perf-bar-bg" style={{ height: '4px', marginTop: '10px' }}>
                            <div className="perf-bar-fill" style={{ width: animate ? '85%' : '0%', background: '#00ff88' }}></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdvancedSpecsModal;
