import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaHeart, FaComment, FaPlus } from 'react-icons/fa';
import './Community.css';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'discussion' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/community');
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }
    try {
      await axios.post(`/api/community/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to create posts');
      return;
    }
    try {
      await axios.post('/api/community', newPost);
      setShowCreateModal(false);
      setNewPost({ title: '', content: '', category: 'discussion' });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="community-page">
      <div className="container">
        <div className="community-header">
          <div>
            <h1>Community</h1>
            <p>Share experiences and connect with other tech enthusiasts</p>
          </div>
          {user && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus /> New Post
            </button>
          )}
        </div>

        <div className="posts-grid">
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">
                    {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="author-name">{post.user?.name || 'Anonymous'}</p>
                    <p className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`post-category ${post.category}`}>
                  {post.category}
                </span>
              </div>

              <Link to={`/community/${post._id}`}>
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 200)}...</p>
              </Link>

              {post.device && (
                <div className="post-device">
                  <span>Related to: {post.device.name}</span>
                </div>
              )}

              <div className="post-footer">
                <button
                  className="action-btn"
                  onClick={() => handleLike(post._id)}
                >
                  <FaHeart className={post.likes?.includes(user?._id) ? 'liked' : ''} />
                  <span>{post.likes?.length || 0}</span>
                </button>
                <div className="action-btn">
                  <FaComment />
                  <span>{post.comments?.length || 0}</span>
                </div>
                <div className="post-views">
                  {post.views} views
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="no-posts">
            <p>No posts yet. Be the first to share!</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Post</h2>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                >
                  <option value="discussion">Discussion</option>
                  <option value="review">Review</option>
                  <option value="question">Question</option>
                  <option value="experience">Experience</option>
                  <option value="tip">Tip</option>
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  required
                  rows={6}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;

