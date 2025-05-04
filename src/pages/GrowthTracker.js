import React, { useState } from 'react';
import '../styles/history.css';

function GrowthTracker() {
  const [growthHistory] = useState([
    { date: '2025-04-01', event: '🌱 Seed planted' },
    { date: '2025-04-05', event: '🌿 Sprouted first leaves' },
    { date: '2025-04-10', event: '☀️ Moved to sunlight' },
    { date: '2025-04-15', event: '💧 Watered with nutrients' },
    { date: '2025-04-20', event: '🌼 First flower bloomed' },
  ]);

  return (
    <section className="history-section">
      <h1>🌿 Growth Tracker</h1>
      <p>Track your plant’s growth history and progress.</p>

      <div className="history-timeline">
        {growthHistory.map((record, index) => (
          <div key={index} className="history-item">
            <div className="history-date">{record.date}</div>
            <div className="history-event">{record.event}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GrowthTracker;
