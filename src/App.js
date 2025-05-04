import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tutorial from './pages/Tutorial';
import About from './pages/About';
import Upload from './pages/Upload';
import Chatbot from './pages/Chatbot';
import Dashboard from './pages/dashboard/Dashboard';
import PlantIdentification from './pages/plant-identification/PlantIdentification';
import WateringSchedule from './pages/watering-schedule/WateringSchedule';
import Forum from './components/Forum';
import ForumPost from './components/ForumPost';
import CreatePost from './components/CreatePost';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plant-identification" element={<PlantIdentification />} />
        <Route path="/watering-schedule" element={<WateringSchedule />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/post/:id" element={<ForumPost />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </Router>
  );
}

export default App;
