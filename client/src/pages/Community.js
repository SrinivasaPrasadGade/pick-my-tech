import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaHeart, FaComment, FaPlus } from 'react-icons/fa';
import './Community.css';
import CreatePostModal from '../components/community/CreatePostModal';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={fetchPosts}
      />
    </div>
  );
};

export default Community;

