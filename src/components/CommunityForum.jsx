import React, { useState } from 'react';
import { FaSearch, FaEllipsisV, FaPaperclip, FaSmile, FaMicrophone, FaImage } from 'react-icons/fa';
import '../styles/communityForum.css';

const CommunityForum = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John Doe',
      text: 'Hello everyone! I have a question about my Monstera plant...',
      time: '10:30 AM',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4CAF50&color=fff'
    },
    {
      id: 2,
      sender: 'Sarah Smith',
      text: 'Sure, what would you like to know?',
      time: '10:32 AM',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=4CAF50&color=fff'
    },
    {
      id: 3,
      sender: 'John Doe',
      text: 'The leaves are turning yellow. What should I do?',
      time: '10:33 AM',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4CAF50&color=fff'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://ui-avatars.com/api/?name=You&background=4CAF50&color=fff'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="forum-container">
      {/* Header */}
      <div className="forum-header">
        <div className="forum-header-left">
          <img 
            src="https://ui-avatars.com/api/?name=Plant+Community&background=4CAF50&color=fff" 
            alt="Community" 
            className="community-avatar"
          />
          <div className="community-info">
            <h2>Plant Care Community</h2>
            <p>1,234 members</p>
          </div>
        </div>
        <div className="forum-header-right">
          <button className="icon-button">
            <FaSearch />
          </button>
          <button className="icon-button">
            <FaEllipsisV />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="forum-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
            <img src={msg.avatar} alt={msg.sender} className="message-avatar" />
            <div className="message-content">
              <div className="message-header">
                <span className="sender-name">{msg.sender}</span>
                <span className="message-time">{msg.time}</span>
              </div>
              <p className="message-text">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form className="forum-input-container" onSubmit={handleSendMessage}>
        <div className="input-wrapper">
          <button type="button" className="icon-button">
            <FaPaperclip />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="forum-input"
          />
          <button type="button" className="icon-button">
            <FaSmile />
          </button>
          <button type="button" className="icon-button">
            <FaImage />
          </button>
        </div>
        <button type="submit" className="send-button">
          <FaMicrophone />
        </button>
      </form>
    </div>
  );
};

export default CommunityForum; 