import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaUser, FaArrowLeft, FaCalendar } from 'react-icons/fa';
import './Community.css';

const CommunityPostDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await axios.get(`/api/community/${id}`);
            setPost(res.data.post);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) {
            alert('Please login to like posts');
            return;
        }
        try {
            await axios.post(`/api/community/${id}/like`);
            fetchPost();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to comment');
            return;
        }
        try {
            await axios.post(`/api/community/${id}/comments`, { content: newComment });
            setNewComment('');
            fetchPost();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    if (loading) return <div className="loader"></div>;
    if (!post) return <div className="container">Post not found</div>;

    return (
        <div className="community-page">
            <div className="container">
                <Link to="/community" className="back-link">
                    <FaArrowLeft /> Back to Community
                </Link>

                <div className="post-detail-card">
                    <div className="post-header">
                        <div className="post-author">
                            <div className="author-avatar">
                                {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="author-name">{post.user?.name || 'Anonymous'}</p>
                                <div className="post-meta">
                                    <span className="post-date">
                                        <FaCalendar /> {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className={`post-category ${post.category}`}>
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-content">
                        {post.content.split('\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>

                    {post.device && (
                        <div className="post-device-tag">
                            Related to: <Link to={`/devices/${post.device._id}`}>{post.device.name}</Link>
                        </div>
                    )}

                    <div className="post-actions">
                        <button
                            className={`action-btn ${post.likes?.includes(user?._id) ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            <FaHeart /> {post.likes?.length || 0} Likes
                        </button>
                    </div>
                </div>

                <div className="comments-section">
                    <h3>Comments ({post.comments?.length || 0})</h3>

                    {user && (
                        <form onSubmit={handleComment} className="comment-form">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                required
                                rows={3}
                            />
                            <button type="submit" className="btn btn-primary">Post Comment</button>
                        </form>
                    )}

                    <div className="comments-list">
                        {post.comments?.map((comment, index) => (
                            <div key={index} className="comment-card">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.user?.name || 'User'}</span>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="comment-content">{comment.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPostDetail;
