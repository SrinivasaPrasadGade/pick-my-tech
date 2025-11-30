import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './ReviewForm.css';

const ReviewForm = ({ deviceId, onReviewSubmitted }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Please login to submit a review');
            return;
        }
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (content.trim().length < 10) {
            setError('Review content must be at least 10 characters');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            await axios.post(`/api/reviews/${deviceId}`, {
                rating,
                content
            });

            // Reset form
            setRating(0);
            setContent('');
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="review-login-prompt">
                <p>Please login to write a review.</p>
            </div>
        );
    }

    return (
        <div className="review-form-container">
            <h3>Write a Review</h3>
            <form onSubmit={handleSubmit}>
                <div className="rating-input">
                    <label>Rating:</label>
                    <div className="stars">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => setRating(ratingValue)}
                                    />
                                    <FaStar
                                        className="star"
                                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        size={25}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="content-input">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your experience with this device... (min 10 characters)"
                        rows="4"
                        disabled={submitting}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting}
                >
                    {submitting ? 'Analyzing & Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
