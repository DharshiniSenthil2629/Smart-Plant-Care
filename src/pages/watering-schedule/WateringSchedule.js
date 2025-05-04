import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWater, FaCloudSun, FaBell, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/watering-schedule.css';

const WateringSchedule = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      plantName: 'Monstera',
      frequency: 'Every 3 days',
      lastWatered: '2023-04-15',
      nextWatering: '2023-04-18',
      amount: '500ml',
      weatherAdjusted: true
    },
    {
      id: 2,
      plantName: 'Snake Plant',
      frequency: 'Every 2 weeks',
      lastWatered: '2023-04-10',
      nextWatering: '2023-04-24',
      amount: '300ml',
      weatherAdjusted: false
    }
  ]);

  const [weather, setWeather] = useState({
    temperature: 25,
    humidity: 60,
    forecast: 'Sunny'
  });

  useEffect(() => {
    // Simulate weather data fetching
    const fetchWeather = async () => {
      try {
        // Replace with actual weather API call
        const mockWeather = {
          temperature: Math.random() * 10 + 20,
          humidity: Math.random() * 40 + 40,
          forecast: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)]
        };
        setWeather(mockWeather);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, []);

  const handleWatering = (scheduleId) => {
    setSchedules(schedules.map(schedule => {
      if (schedule.id === scheduleId) {
        const today = new Date();
        const frequencyMatch = schedule.frequency.match(/\d+/);
        const daysToAdd = frequencyMatch ? parseInt(frequencyMatch[0]) : 0;
        
        const nextWatering = new Date(today);
        nextWatering.setDate(today.getDate() + daysToAdd);
        
        return {
          ...schedule,
          lastWatered: today.toISOString().split('T')[0],
          nextWatering: nextWatering.toISOString().split('T')[0]
        };
      }
      return schedule;
    }));
  };

  return (
    <div className="watering-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="watering-content"
      >
        <h1 className="watering-title">Watering Schedule</h1>

        {/* Weather Information */}
        <div className="weather-container">
          <h2 className="weather-title">Current Weather</h2>
          <div className="weather-grid">
            <div className="weather-item">
              <FaCloudSun className="weather-icon" />
              <div>
                <p className="weather-label">Temperature</p>
                <p className="weather-value">{weather.temperature.toFixed(1)}°C</p>
              </div>
            </div>
            <div className="weather-item">
              <FaWater className="weather-icon" />
              <div>
                <p className="weather-label">Humidity</p>
                <p className="weather-value">{weather.humidity}%</p>
              </div>
            </div>
            <div className="weather-item">
              <FaCalendarAlt className="weather-icon" />
              <div>
                <p className="weather-label">Forecast</p>
                <p className="weather-value">{weather.forecast}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Watering Schedules */}
        <div className="schedules-grid">
          {schedules.map((schedule) => (
            <motion.div
              key={schedule.id}
              whileHover={{ scale: 1.02 }}
              className="schedule-card"
            >
              <div className="schedule-header">
                <h3 className="schedule-title">{schedule.plantName}</h3>
                {schedule.weatherAdjusted && (
                  <span className="weather-adjusted">
                    Weather Adjusted
                  </span>
                )}
              </div>
              
              <div className="schedule-details">
                <div className="schedule-row">
                  <span className="schedule-label">Frequency:</span>
                  <span className="schedule-value">{schedule.frequency}</span>
                </div>
                <div className="schedule-row">
                  <span className="schedule-label">Last Watered:</span>
                  <span className="schedule-value">{schedule.lastWatered}</span>
                </div>
                <div className="schedule-row">
                  <span className="schedule-label">Next Watering:</span>
                  <span className="schedule-value">{schedule.nextWatering}</span>
                </div>
                <div className="schedule-row">
                  <span className="schedule-label">Amount:</span>
                  <span className="schedule-value">{schedule.amount}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWatering(schedule.id)}
                className="water-button"
              >
                <FaWater />
                <span>Mark as Watered</span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Add New Schedule Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="add-schedule-button"
        >
          <FaBell />
          <span>Add New Schedule</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WateringSchedule; 