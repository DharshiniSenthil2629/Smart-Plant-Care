import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaImage, FaThumbsUp, FaComment, FaShare, FaEllipsisH, FaSmile, FaMicrophone, FaTimes } from 'react-icons/fa';
import '../styles/communityForum.css';

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [modalImage, setModalImage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() === '' && !selectedImage) return;

    const post = {
      id: Date.now(),
      content: newPost,
      image: selectedImage,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
      user: {
        name: 'User Name',
        avatar: 'https://via.placeholder.com/40',
        role: 'Plant Enthusiast'
      }
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedImage(null);
  };

  const handleImageClick = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleComment = (postId) => {
    if (!commentText.trim()) return;
    
    setPosts(posts.map(post => 
      post.id === postId ? {
        ...post,
        comments: [...post.comments, {
          id: Date.now(),
          content: commentText,
          user: {
            name: 'User Name',
            avatar: 'https://via.placeholder.com/40',
            role: 'Plant Enthusiast'
          },
          timestamp: new Date().toISOString()
        }]
      } : post
    ));
    setCommentText('');
    setActiveCommentId(null);
  };

  const handleVoiceInput = () => {
    // Implement voice input functionality
    alert('Voice input feature coming soon!');
  };

  return (
    <div className="community-forum">
      <div className="forum-header">
        <h1>Plant Care Community</h1>
        <p>Share your plant care experiences and get help from the community</p>
      </div>

      <div className="forum-content">
        <div className="create-post">
          <form onSubmit={handlePostSubmit}>
            <div className="post-input-container">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your plant care experience..."
                className="post-input"
              />
              <div className="post-input-actions">
                <button type="button" className="action-icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <FaSmile />
                </button>
                <button type="button" className="action-icon" onClick={handleVoiceInput}>
                  <FaMicrophone />
                </button>
              </div>
            </div>
            
            {selectedImage && (
              <div className="image-preview">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  onClick={() => handleImageClick(selectedImage)}
                />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </button>
              </div>
            )}
            
            <div className="post-actions">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="image-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" className="upload-button">
                <FaImage />
              </label>
              <button type="submit" className="post-button">
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>

        <div className="posts-container">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-user-info">
                  <img src={post.user.avatar} alt={post.user.name} className="user-avatar" />
                  <div className="post-info">
                    <h3>{post.user.name}</h3>
                    <span className="user-role">{post.user.role}</span>
                    <span className="timestamp">
                      {new Date(post.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button className="post-menu">
                  <FaEllipsisH />
                </button>
              </div>
              
              <div className="post-content">
                {post.content}
                {post.image && (
                  <div className="post-image">
                    <img 
                      src={post.image} 
                      alt="Post" 
                      onClick={() => handleImageClick(post.image)}
                    />
                  </div>
                )}
              </div>

              <div className="post-actions">
                <button onClick={() => handleLike(post.id)} className="action-button">
                  <FaThumbsUp /> {post.likes}
                </button>
                <button 
                  onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)} 
                  className="action-button"
                >
                  <FaComment /> {post.comments.length}
                </button>
                <button className="action-button">
                  <FaShare />
                </button>
              </div>

              {activeCommentId === post.id && (
                <div className="comment-input-container">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="comment-input"
                  />
                  <button 
                    onClick={() => handleComment(post.id)}
                    className="comment-submit"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              )}

              <div className="comments-section">
                {post.comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <img src={comment.user.avatar} alt={comment.user.name} className="user-avatar" />
                    <div className="comment-content">
                      <div className="comment-header">
                        <div>
                          <h4>{comment.user.name}</h4>
                          <span className="user-role">{comment.user.role}</span>
                        </div>
                        <span className="timestamp">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {modalImage && (
        <div className="image-modal" onClick={closeModal}>
          <button className="image-modal-close" onClick={closeModal}>
            <FaTimes />
          </button>
          <img 
            src={modalImage} 
            alt="Full size" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default CommunityForum; 