import React, { useMemo } from 'react';
import { FaLightbulb, FaTimes, FaTrophy } from 'react-icons/fa';
import './ComparisonAnalyticsModal.css';

const ComparisonAnalyticsModal = ({ isOpen, onClose, devices }) => {
    // Filter out null devices
    const activeDevices = devices.filter(d => d !== null);

    const insights = useMemo(() => {
        if (activeDevices.length < 2) return [];

        const [d1, d2] = activeDevices;
        const results = [];

        // Helper to parse numbers from strings (e.g., "5000 mAh" -> 5000)
        const parseNum = (str) => {
            if (!str) return 0;
            const match = str.toString().match(/(\d+(\.\d+)?)/);
            return match ? parseFloat(match[0]) : 0;
        };

        // 1. Battery Comparison
        const bat1 = parseNum(d1.specifications?.battery?.capacity);
        const bat2 = parseNum(d2.specifications?.battery?.capacity);

        if (bat1 && bat2) {
            const diff = Math.abs(bat1 - bat2);
            const percent = ((diff / Math.min(bat1, bat2)) * 100).toFixed(0);

            if (bat1 > bat2) {
                results.push({
                    category: 'Battery',
                    winner: d1.name,
                    text: `${d1.name} has a ${percent}% larger battery (${bat1} mAh) compared to ${d2.name} (${bat2} mAh).`,
                    icon: '🔋'
                });
            } else if (bat2 > bat1) {
                results.push({
                    category: 'Battery',
                    winner: d2.name,
                    text: `${d2.name} has a ${percent}% larger battery (${bat2} mAh) compared to ${d1.name} (${bat1} mAh).`,
                    icon: '🔋'
                });
            }
        }

        // 2. RAM Comparison
        const ram1 = parseNum(d1.specifications?.memory?.ram);
        const ram2 = parseNum(d2.specifications?.memory?.ram);

        if (ram1 && ram2) {
            if (ram1 > ram2) {
                results.push({
                    category: 'Memory',
                    winner: d1.name,
                    text: `${d1.name} offers more RAM (${ram1}GB) for better multitasking than ${d2.name} (${ram2}GB).`,
                    icon: '💾'
                });
            } else if (ram2 > ram1) {
                results.push({
                    category: 'Memory',
                    winner: d2.name,
                    text: `${d2.name} offers more RAM (${ram2}GB) for better multitasking than ${d1.name} (${ram1}GB).`,
                    icon: '💾'
                });
            }
        }

        // 3. Refresh Rate Comparison
        const rr1 = parseNum(d1.specifications?.display?.refreshRate);
        const rr2 = parseNum(d2.specifications?.display?.refreshRate);

        if (rr1 && rr2) {
            if (rr1 > rr2) {
                results.push({
                    category: 'Display',
                    winner: d1.name,
                    text: `${d1.name} has a smoother display with ${rr1}Hz refresh rate vs ${rr2}Hz on ${d2.name}.`,
                    icon: '📱'
                });
            } else if (rr2 > rr1) {
                results.push({
                    category: 'Display',
                    winner: d2.name,
                    text: `${d2.name} has a smoother display with ${rr2}Hz refresh rate vs ${rr1}Hz on ${d1.name}.`,
                    icon: '📱'
                });
            }
        }

        // 4. Camera Resolution (Main)
        // Very basic parsing for "48MP" etc.
        const getCamMP = (str) => parseNum(str?.split('+')[0]); // Get first camera MP
        const cam1 = getCamMP(d1.specifications?.camera?.rear);
        const cam2 = getCamMP(d2.specifications?.camera?.rear);

        if (cam1 && cam2) {
            if (cam1 > cam2) {
                results.push({
                    category: 'Camera',
                    winner: d1.name,
                    text: `${d1.name} boasts a higher resolution main camera (${cam1}MP) than ${d2.name} (${cam2}MP).`,
                    icon: '📸'
                });
            } else if (cam2 > cam1) {
                results.push({
                    category: 'Camera',
                    winner: d2.name,
                    text: `${d2.name} boasts a higher resolution main camera (${cam2}MP) than ${d1.name} (${cam1}MP).`,
                    icon: '📸'
                });
            }
        }

        // 5. Price Comparison
        const getPrice = (d) => d.prices && d.prices.length ? Math.min(...d.prices.map(p => p.price)) : 0;
        const p1 = getPrice(d1);
        const p2 = getPrice(d2);

        if (p1 && p2) {
            const diff = Math.abs(p1 - p2);
            if (p1 < p2) {
                results.push({
                    category: 'Value',
                    winner: d1.name,
                    text: `${d1.name} is cheaper by $${diff.toLocaleString()}, making it a more budget-friendly option.`,
                    icon: '💰'
                });
            } else if (p2 < p1) {
                results.push({
                    category: 'Value',
                    winner: d2.name,
                    text: `${d2.name} is cheaper by $${diff.toLocaleString()}, making it a more budget-friendly option.`,
                    icon: '💰'
                });
            }
        }

        return results;
    }, [activeDevices]);

    if (!isOpen || activeDevices.length < 2) return null;

    const [d1, d2] = activeDevices;
    const d1Wins = insights.filter(i => i.winner === d1.name).length;
    const d2Wins = insights.filter(i => i.winner === d2.name).length;

    return (
        <div className="comparison-analytics-overlay" onClick={onClose}>
            <div className="comparison-analytics-modal dark-mode" onClick={e => e.stopPropagation()}>
                <div className="analytics-header">
                    <h2><FaLightbulb color="#ffc107" /> Smart Comparison Insights</h2>
                    <button className="close-btn" onClick={onClose}><FaTimes /></button>
                </div>

                <div className="analytics-content">
                    <div className="summary-box">
                        <div className="device-summary">
                            <h3>{d1.name}</h3>
                            <div className="win-count">{d1Wins}</div>
                            <div className="win-label">Key Advantages</div>
                        </div>
                        <div className="device-summary">
                            <h3>{d2.name}</h3>
                            <div className="win-count">{d2Wins}</div>
                            <div className="win-label">Key Advantages</div>
                        </div>
                    </div>

                    <div className="insight-section">
                        {insights.map((insight, index) => (
                            <div key={index} className={`insight-card ${insight.winner === d1.name ? 'winner-a' : 'winner-b'}`}>
                                <div className="winner-badge badge-blue">
                                    {insight.icon} {insight.category} Winner: {insight.winner}
                                </div>
                                <div className="insight-text">
                                    {insight.text.split(insight.winner).map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && <span className="highlight">{insight.winner}</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {insights.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                No significant specification differences found to analyze automatically.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonAnalyticsModal;
