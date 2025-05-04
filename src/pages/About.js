import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/about.css';

function About() {
  return (
    <section className="about-section">
      <div className="about-container">
        <h1 className="about-title">🌱 About Smart Plant Care Assistant</h1>
        <p className="about-intro">
          Welcome to your personal gardening companion! 🌿<br />
          Our mission is to make plant care simple, smart, and stress-free.
        </p>

        <div className="about-content">
          <h2>Our Vision</h2>
          <p>
            We believe every plant deserves the best care. Whether you're a beginner or an expert gardener, our assistant helps
            you monitor, understand, and care for your plants effortlessly.
          </p>

          <h2>What We Offer 🌟</h2>
          <ul>
            <li>📸 AI-powered plant health analysis through image recognition.</li>
            <li>🗣️ Voice assistant for hands-free gardening guidance.</li>
            <li>💬 Chatbot for quick plant care tips and troubleshooting.</li>
            <li>📊 Growth tracker to monitor your plant’s progress over time.</li>
            <li>🎓 Personalized tutorials to boost your plant knowledge.</li>
          </ul>

          <h2>Our Promise</h2>
          <p>
            Your green friends are in safe hands! We continuously improve our assistant to give you real-time updates, smart suggestions,
            and an overall joyful plant care experience.
          </p>

          <div className="about-buttons">
            <Link to="/chatbot" className="btn">🌿 Explore More</Link>
            <Link to="/diagnosis" className="btn">🚀 Get Started</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
