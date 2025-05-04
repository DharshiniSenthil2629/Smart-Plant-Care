import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/upload.css';

const Upload = () => {
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;

        // Optional: Save to localStorage if you want
        localStorage.setItem('uploadedImage', base64Image);

        // ✅ Pass image as state to Chatbot page
        navigate('/chatbot', { state: { imageUrl: base64Image } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    
    <div className="upload-page">
      <br></br>
      <br></br>
      <br></br>
      <h2>Upload a Plant Image</h2>
      <br></br>
      <input type="file" accept="image/*" onChange={handleImageChange} />
    </div>
  );
};

export default Upload;
