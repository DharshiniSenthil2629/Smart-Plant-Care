import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forumService } from '../services/forumService';
import '../styles/Forum.css';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await forumService.getPosts();
        setPosts(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h1>Plant Care Forum</h1>
        <Link to="/create-post" className="create-post-btn">
          Create New Post
        </Link>
      </div>
      
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h2>{post.title}</h2>
            <p className="post-meta">
              Posted by {post.author} on {new Date(post.date).toLocaleDateString()}
            </p>
            <p className="post-preview">{post.content.substring(0, 150)}...</p>
            <Link to={`/post/${post.id}`} className="read-more">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum; 