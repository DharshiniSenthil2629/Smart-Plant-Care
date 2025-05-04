import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTemperatureHigh, FaTint, FaSun, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const [plantData, setPlantData] = useState({
    temperature: 0,
    moisture: 0,
    light: 0,
    health: 'Good'
  });

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // Replace with actual API call
      const mockData = {
        temperature: Math.random() * 10 + 20, // 20-30°C
        moisture: Math.random() * 50 + 50, // 50-100%
        light: Math.random() * 100, // 0-100%
        health: ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)]
      };
      setPlantData(mockData);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const healthStatusColor = {
    Good: 'health-status-good',
    Fair: 'health-status-fair',
    Poor: 'health-status-poor'
  };

  return (
    <div className="dashboard-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-content"
      >
        <h1 className="dashboard-title">Plant Health Dashboard</h1>
        
        <div className="metrics-grid">
          {/* Temperature Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="metric-card"
          >
            <div className="metric-header">
              <FaTemperatureHigh className="metric-icon" style={{ color: '#ef4444' }} />
              <span className="metric-value">{plantData.temperature.toFixed(1)}°C</span>
            </div>
            <h3 className="metric-title">Temperature</h3>
            <p className="metric-description">Current plant environment temperature</p>
          </motion.div>

          {/* Moisture Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="metric-card"
          >
            <div className="metric-header">
              <FaTint className="metric-icon" style={{ color: '#3b82f6' }} />
              <span className="metric-value">{plantData.moisture.toFixed(1)}%</span>
            </div>
            <h3 className="metric-title">Soil Moisture</h3>
            <p className="metric-description">Current soil moisture level</p>
          </motion.div>

          {/* Light Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="metric-card"
          >
            <div className="metric-header">
              <FaSun className="metric-icon" style={{ color: '#f59e0b' }} />
              <span className="metric-value">{plantData.light.toFixed(1)}%</span>
            </div>
            <h3 className="metric-title">Light Level</h3>
            <p className="metric-description">Current light exposure</p>
          </motion.div>

          {/* Health Status Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="metric-card"
          >
            <div className="metric-header">
              <FaChartLine className="metric-icon" style={{ color: '#10b981' }} />
              <span className={`metric-value ${healthStatusColor[plantData.health]}`}>
                {plantData.health}
              </span>
            </div>
            <h3 className="metric-title">Health Status</h3>
            <p className="metric-description">Overall plant health condition</p>
          </motion.div>
        </div>

        {/* Alerts Section */}
        <div className="alerts-section">
          <h2 className="alerts-title">Recent Alerts</h2>
          <div className="alerts-container">
            {alerts.length === 0 ? (
              <p className="metric-description">No recent alerts</p>
            ) : (
              <ul className="alert-list">
                {alerts.map((alert, index) => (
                  <li key={index} className="alert-item">
                    <div className={`alert-indicator ${alert.type === 'warning' ? 'warning' : 'error'}`} />
                    <p className="alert-message">{alert.message}</p>
                    <span className="alert-time">{alert.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 