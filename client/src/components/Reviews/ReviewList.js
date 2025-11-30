import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaThumbsUp, FaThumbsDown, FaRobot } from 'react-icons/fa';
import './ReviewList.css';

const ReviewList = ({ deviceId, refreshTrigger }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReviews();
    }, [deviceId, page, refreshTrigger]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/reviews/${deviceId}?page=${page}`);
            setReviews(res.data.reviews);
            setTotalPages(res.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSentimentColor = (score, label) => {
        if (label === 'POSITIVE') return `rgba(40, 167, 69, ${score})`; // Green
        if (label === 'NEGATIVE') return `rgba(220, 53, 69, ${score})`; // Red
        return `rgba(108, 117, 125, ${score})`; // Grey
    };

    if (loading && reviews.length === 0) return <div className="loader">Loading reviews...</div>;

    return (
        <div className="review-list-container">
            <h3>User Reviews</h3>

            {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to review!</p>
            ) : (
                <div className="reviews-grid">
                    {reviews.map((review) => (
                        <div key={review._id} className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <img
                                        src={review.user?.image || 'https://via.placeholder.com/40'}
                                        alt={review.user?.name || 'User'}
                                        className="reviewer-avatar"
                                    />
                                    <div>
                                        <span className="reviewer-name">{review.user?.name || 'Anonymous'}</span>
                                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="review-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < review.rating ? "#ffc107" : "#e4e5e9"} />
                                    ))}
                                </div>
                            </div>

                            <div className="review-content">
                                <p>{review.content}</p>
                            </div>

                            {/* AI Sentiment Analysis Section */}
                            <div className="sentiment-analysis">
                                <div className="sentiment-header">
                                    <FaRobot className="ai-icon" />
                                    <span>AI Analysis</span>
                                    <div
                                        className="sentiment-badge"
                                        style={{ backgroundColor: getSentimentColor(review.sentimentScore, review.sentimentLabel) }}
                                    >
                                        {review.sentimentLabel} ({(review.sentimentScore * 100).toFixed(0)}%)
                                    </div>
                                </div>

                                {(review.pros?.length > 0 || review.cons?.length > 0) && (
                                    <div className="pros-cons-grid">
                                        {review.pros?.length > 0 && (
                                            <div className="pros-column">
                                                <h5 className="text-success"><FaThumbsUp /> Pros</h5>
                                                <ul>
                                                    {review.pros.map((pro, idx) => (
                                                        <li key={idx}>{pro}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {review.cons?.length > 0 && (
                                            <div className="cons-column">
                                                <h5 className="text-danger"><FaThumbsDown /> Cons</h5>
                                                <ul>
                                                    {review.cons.map((con, idx) => (
                                                        <li key={idx}>{con}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="btn btn-secondary"
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="btn btn-secondary"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
