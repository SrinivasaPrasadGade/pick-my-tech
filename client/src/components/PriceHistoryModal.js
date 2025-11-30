import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { FaTimes, FaArrowDown, FaArrowUp, FaBell } from 'react-icons/fa';
import './PriceHistoryModal.css';

const PriceHistoryModal = ({ isOpen, onClose, currentPrice, deviceName }) => {
    // Generate mock data based on current price
    const data = useMemo(() => {
        if (!currentPrice) return [];

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const result = [];
        let basePrice = currentPrice * 1.1; // Start slightly higher on average

        months.forEach((month, index) => {
            // Random fluctuation between -5% and +5%
            const fluctuation = (Math.random() - 0.5) * 0.1;
            let price = basePrice * (1 + fluctuation);

            // Ensure the last price matches current price closely
            if (index === months.length - 1) {
                price = currentPrice;
            } else {
                // Slowly trend towards current price
                basePrice = basePrice - (basePrice - currentPrice) * 0.3;
            }

            result.push({
                name: month,
                price: Math.round(price)
            });
        });
        return result;
    }, [currentPrice]);

    if (!isOpen) return null;

    const lowestPrice = Math.min(...data.map(d => d.price));
    const highestPrice = Math.max(...data.map(d => d.price));
    const isPriceDrop = data[0].price > data[data.length - 1].price;

    return (
        <div className="price-modal-overlay" onClick={onClose}>
            <div className="price-modal-content" onClick={e => e.stopPropagation()}>
                <div className="price-modal-header">
                    <div>
                        <h2>Price History</h2>
                        <p className="device-name-subtitle">{deviceName}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="price-summary-cards">
                    <div className="summary-card current">
                        <span className="label">Current Price</span>
                        <span className="value">${currentPrice?.toLocaleString()}</span>
                    </div>
                    <div className="summary-card lowest">
                        <span className="label">Lowest (6m)</span>
                        <span className="value">${lowestPrice.toLocaleString()}</span>
                    </div>
                    <div className="summary-card trend">
                        <span className="label">Trend</span>
                        <span className={`value ${isPriceDrop ? 'down' : 'up'}`}>
                            {isPriceDrop ? <FaArrowDown /> : <FaArrowUp />}
                            {isPriceDrop ? ' Dropping' : ' Rising'}
                        </span>
                    </div>
                </div>

                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a0a0a0', fontSize: 12 }}
                            />
                            <YAxis
                                hide={true}
                                domain={['dataMin - 100', 'dataMax + 100']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(20, 20, 20, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="price-alert-section">
                    <div className="alert-info">
                        <FaBell className="bell-icon" />
                        <div>
                            <h4>Set Price Alert</h4>
                            <p>Get notified when price drops below ${currentPrice?.toLocaleString()}</p>
                        </div>
                    </div>
                    <button className="set-alert-btn">Set Alert</button>
                </div>
            </div>
        </div>
    );
};

export default PriceHistoryModal;
