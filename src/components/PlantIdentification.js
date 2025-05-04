import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import '../styles/plantIdentification.css';

const PlantIdentification = () => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
        setModel(loadedModel);
        setResult('🌱 Plant recognition model loaded successfully! You can now upload plant images.');
      } catch (error) {
        console.error('Error loading model:', error);
        setError('❌ Error loading the image processing model. Please try again later.');
      }
    };

    loadModel();
  }, []);

  const processImage = async (imageData) => {
    if (!model) {
      setError('❌ Image processing model is not loaded yet. Please wait and try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setResult('🔍 Analyzing plant...');

      const img = new Image();
      img.src = imageData;
      
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
      const predictions = await model.predict(tensor).data();
      
      // Get top prediction
      const topPrediction = Array.from(predictions)
        .map((prob, index) => ({ probability: prob, index }))
        .sort((a, b) => b.probability - a.probability)[0];

      const confidence = (topPrediction.probability * 100).toFixed(1);

      // Get specific plant name and disease detection
      const prompt = `I have an image of a plant. Please identify:
1. The EXACT plant name from this list:
Monstera Deliciosa
Snake Plant
Peace Lily
Pothos
ZZ Plant
Fiddle Leaf Fig
Aloe Vera
Chinese Evergreen
Spider Plant
Rubber Plant
Philodendron
Calathea
Bird of Paradise
Dracaena
Jade Plant

2. Any visible plant diseases or health issues from this list:
Leaf Spot
Powdery Mildew
Root Rot
Spider Mites
Scale Insects
Aphids
Yellowing Leaves
Brown Tips
Wilting
Leaf Drop

Format your response exactly like this:
Plant: [plant name]
Health Status: [disease/issue or "Healthy"]
Confidence: [confidence]%

If the plant doesn't match any in the list, respond with "Unknown Plant". If no diseases are visible, respond with "Healthy".`;

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAXcBboad6mZEA280k0rDQ8rt2NjIeHHjk",
        {
          contents: [{ 
            parts: [{ 
              text: prompt
            }] 
          }]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const resultText = response.data.candidates[0].content.parts[0].text.trim();
      const lines = resultText.split('\n');
      
      let formattedResult = '';
      lines.forEach(line => {
        if (line.startsWith('Plant:')) {
          const plantName = line.replace('Plant:', '').trim();
          formattedResult += `🌿 *Plant:* **${plantName}**\n`;
        } else if (line.startsWith('Health Status:')) {
          const healthStatus = line.replace('Health Status:', '').trim();
          const emoji = healthStatus === 'Healthy' ? '✅' : '⚠️';
          formattedResult += `${emoji} *Health Status:* **${healthStatus}**\n`;
        } else if (line.startsWith('Confidence:')) {
          const confidence = line.replace('Confidence:', '').trim();
          formattedResult += `📊 *Confidence:* **${confidence}**`;
        }
      });

      setResult(formattedResult);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('❌ Sorry, I could not analyze the image. Please try again with a different image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('❌ Please upload an image file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPreviewImage(base64);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="plant-identification">
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          id="plant-image-upload"
          className="file-input"
        />
        <label htmlFor="plant-image-upload" className="upload-button">
          📸 Upload Plant Image
        </label>
      </div>

      {previewImage && (
        <div className="image-preview">
          <img src={previewImage} alt="Plant preview" />
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>🔍 Analyzing plant...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {result && !isLoading && !error && (
        <div className="result">
          {result}
        </div>
      )}
    </div>
  );
};

export default PlantIdentification; 