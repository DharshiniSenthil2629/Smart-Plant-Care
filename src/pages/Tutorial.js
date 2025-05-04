import React, { useState } from 'react';
import YouTube from 'react-youtube';  // Import YouTube component
import '../styles/Tutorial.css'; // Make sure you have styles
import { FaSearch } from 'react-icons/fa';

const tutorials = [
  {
    title: "Plant Care Basics",
    description: "Learn the basics of plant care, watering schedules, and light requirements.",
    videoId: "LZhnCxG5c6s"  // Updated Video ID from new YouTube link
  },
  {
    title: "How to Care for Indoor Plants",
    description: "Tips for keeping indoor plants healthy and thriving.",
    videoId: "c4XHLNq-jhI"  // Video ID from YouTube Shorts
  },
  {
    title: "Watering Plants the Right Way",
    description: "How to water plants effectively and avoid overwatering.",
    videoId: "t310xVtEcfM"  // Video ID from YouTube Shorts
  },
  {
    title: "Common Mistakes in Plant Care",
    description: "Avoid common mistakes and help your plants thrive.",
    videoId: "5SfmQXYQpBE"  // Video ID from YouTube link
  }
];

const Tutorial = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTutorials = tutorials.filter((tutorial) =>
    tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="youtube-container">
      <h1>🌿 AI Plant Care Tutorials</h1>
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search tutorials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="video-grid">
        {filteredTutorials.map((tutorial, index) => (
          <div className="video-card" key={index}>
            <YouTube
              videoId={tutorial.videoId}  // Pass the videoId here
              opts={{
                width: '100%',
                height: '315',
                playerVars: {
                  autoplay: 1, // Play video automatically
                },
              }}
            />
            <h3>{tutorial.title}</h3>
            <p>{tutorial.description}</p>
          </div>
        ))}
        {filteredTutorials.length === 0 && (
          <p className="no-results">No tutorials found.</p>
        )}
      </div>
    </div>
  );
};

export default Tutorial;
