import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { motion } from 'framer-motion';
import { FaCamera, FaSpinner, FaCameraRetro } from 'react-icons/fa';
import '../../styles/plant-identification.css';

const PlantIdentification = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);

  // Load the model when component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        // Load MobileNet model
        modelRef.current = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
        setLoading(false);
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load the plant identification model. Please try again later.');
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check your camera permissions or try uploading an image instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      // Convert canvas to blob
      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        handleImageUpload({ target: { files: [file] } });
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError('No file selected. Please choose an image.');
      return;
    }

    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.).');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size too large. Please select an image under 5MB.');
      return;
    }

    if (!modelRef.current) {
      setError('Model is not loaded yet. Please wait and try again.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Create a URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      // Preprocess the image
      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load the image.'));
      });

      // Preprocess the image for MobileNet
      const tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims()
        .div(tf.scalar(127.5))
        .sub(tf.scalar(1.0));
      
      // Make prediction
      const predictions = await modelRef.current.predict(tensor).data();
      
      // Get top 3 predictions
      const top3 = Array.from(predictions)
        .map((prob, index) => ({ probability: prob, index }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3);
      
      // Process results
      const topPrediction = {
        plantName: 'Plant Species', // In a real app, you would map this to actual plant names
        confidence: (top3[0].probability * 100).toFixed(1),
        description: 'This is a general plant description based on the image analysis.',
        careTips: [
          'Water when the top inch of soil is dry',
          'Provide bright, indirect sunlight',
          'Maintain room temperature between 18-24°C',
          'Fertilize monthly during growing season'
        ]
      };
      
      setResult(topPrediction);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraClick = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="plant-id-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="plant-id-content"
      >
        <h1 className="plant-id-title">Plant Identification</h1>
        
        <div className="upload-container">
          <div className="text-center mb-8">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="file-input"
            />
            <div className="button-group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current.click()}
                className="upload-button"
              >
                
                <FaCamera />
                <span>Upload Image</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCameraClick}
                className="upload-button"
                style={{ marginLeft: '1rem' }}
              >
                <FaCameraRetro />
                <span>{isCameraActive ? 'Stop Camera' : 'Take Photo'}</span>
              </motion.button>
            </div>
          </div>

          {isCameraActive && (
            <div className="camera-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-preview"
              />
              <button
                onClick={capturePhoto}
                className="capture-button"
              >
                Capture Photo
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <FaSpinner className="loading-spinner" />
              <p className="loading-text">Analyzing plant...</p>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-message"
            >
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setImage(null);
                  setResult(null);
                }}
                className="upload-button"
                style={{ marginTop: '1rem' }}
              >
                Try Again
              </button>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="result-container"
            >
              <h2 className="result-title">{result.plantName}</h2>
              <div className="result-card">
                <div className="confidence-container">
                  <span className="confidence-label">Confidence:</span>
                  <span className="confidence-value">{result.confidence}%</span>
                </div>
                <p className="plant-description">{result.description}</p>
                <h3 className="care-tips-title">Care Tips:</h3>
                <ul className="care-tips-list">
                  {result.careTips.map((tip, index) => (
                    <li key={index} className="care-tips-item">{tip}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {image && !loading && !result && !error && (
            <div className="mt-8">
              <img
                src={image}
                alt="Uploaded plant"
                className="preview-image"
              />
            </div>
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </motion.div>
    </div>
  );
};

export default PlantIdentification; 