import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMagic } from 'react-icons/fa';
import axios from 'axios';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'discussion' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/community', newPost);
            setNewPost({ title: '', content: '', category: 'discussion' });
            onPostCreated();
            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setLoading(false);
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", duration: 0.5, bounce: 0.3 }
        },
        exit: {
            opacity: 0,
            y: 20,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay glass-overlay"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-content glass-modal"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Create New Post</h2>
                            <button className="close-btn" onClick={onClose}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                    placeholder="What's on your mind?"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <div className="category-select-wrapper">
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
                            </div>

                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                    placeholder="Share your thoughts, experiences, or questions..."
                                    required
                                    rows={6}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-ghost" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreatePostModal;
