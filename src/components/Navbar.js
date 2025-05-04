import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import { FaHome, FaRobot, FaUpload, FaBook, FaChartLine, FaCamera, FaWater, FaComments } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🌱</h2>
      </div>
      
      <ul className="navbar-links">
        <li>
          <Link to="/">
            <FaHome className="icon" />
            <span>About</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <FaChartLine className="icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/plant-identification">
            <FaCamera className="icon" />
            <span>Plant ID</span>
          </Link>
        </li>
        <li>
          <Link to="/watering-schedule">
            <FaWater className="icon" />
            <span>Watering</span>
          </Link>
        </li>
        <li>
          <Link to="/chatbot">
            <FaRobot className="icon" />
            <span>Chatbot</span>
          </Link>
        </li>
        <li>
          <Link to="/upload">
            <FaUpload className="icon" />
            <span>Upload</span>
          </Link>
        </li>
        <li>
          <Link to="/forum">
            <FaComments className="icon" />
            <span>Forum</span>
          </Link>
        </li>
        <li>
          <Link to="/tutorial">
            <FaBook className="icon" />
            <span>Tutorial</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
