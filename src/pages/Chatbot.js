import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaCommentDots, FaImage, FaMicrophone, FaPaperPlane, FaStop } from 'react-icons/fa';
import * as tf from '@tensorflow/tfjs';
import '../styles/chatbot.css';
import { useLocation } from 'react-router-dom';
import CommunityForum from '../components/CommunityForum';

const Chatbot = () => {
  const location = useLocation();
  const imageUrl = location.state?.imageUrl || null;

  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
  }, []);

  useEffect(() => {
    // Load the model when component mounts
    const loadModel = async () => {
      try {
        setLoading(true);
        const loadedModel = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading model:', error);
        updateChatHistory('assistant', '❌ Error loading the image processing model. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setTranscript(speechToText);
        updateChatHistory('user', speechToText);
        handleSend(speechToText);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        let errorMessage = '';
        switch (event.error) {
          case 'no-speech':
            errorMessage = '🎙️ I didn\'t hear anything. Please try speaking again.';
            break;
          case 'audio-capture':
            errorMessage = '🎙️ Please allow microphone access to use voice input.';
            break;
          case 'not-allowed':
            errorMessage = '🎙️ Microphone access was denied. Please enable it in your browser settings.';
            break;
          case 'aborted':
            errorMessage = '🎙️ Voice input was cancelled.';
            break;
          case 'network':
            errorMessage = '🎙️ Network error occurred. Please check your connection.';
            break;
          default:
            errorMessage = `🎙️ Speech recognition error: ${event.error}. Please try again.`;
        }
        updateChatHistory('assistant', errorMessage);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      processImage(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const updateChatHistory = (sender, message, image = null) => {
    setChatHistory(prev => [...prev, { sender, message, image }]);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
        updateChatHistory('assistant', '🎙️ Listening... Please speak now.');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        updateChatHistory('assistant', '🎙️ Error starting voice input. Please try again.');
      }
    } else {
      updateChatHistory('assistant', '🎙️ Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        updateChatHistory('assistant', '🎙️ Voice input stopped.');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        setIsListening(false);
        updateChatHistory('assistant', '🎙️ Error stopping voice input.');
      }
    }
  };

  const speakResponse = (text) => {
    if (speechSynthesisRef.current) {
      // Stop any ongoing speech
      speechSynthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesisRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const formatResponse = (text) => {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\n\*/g, '\n')
      .replace(/\n-/g, '\n')
      .replace(/\n\d+\./g, '\n')
      .trim();
  };

  const handleSend = async (message) => {
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key",
        {
          contents: [{ 
            parts: [{ 
              text: `You are a helpful plant care assistant. Respond in a natural, conversational way like ChatGPT. Don't use markdown formatting, bullet points, or numbered lists. Just write in a friendly, natural tone. Here's the user's question: ${message}`
            }] 
          }]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const replyRaw = response.data.candidates[0].content.parts[0].text;
      const formattedReply = formatResponse(replyRaw);
      updateChatHistory('assistant', formattedReply);
      speakResponse(formattedReply);
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      if (error.response) {
        updateChatHistory('assistant', `❌ API Error: ${error.response.data.error.message}`);
      } else {
        updateChatHistory('assistant', '❌ Sorry, something went wrong with the assistant. Please try again later.');
      }
    }
  };

  const handleTextSend = (e) => {
    e.preventDefault();
    if (userInput.trim() !== '') {
      updateChatHistory('user', userInput);
      handleSend(userInput);
      setUserInput('');
    }
  };

  const processImage = async (imageData) => {
    if (!model) {
      updateChatHistory('assistant', '❌ Image processing model is not loaded yet. Please wait and try again.');
      return;
    }

    try {
      const img = new Image();
      img.src = imageData;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load the image.'));
      });

      updateChatHistory('user', 'Uploaded an image:', imageData);

      const tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims()
        .div(tf.scalar(127.5))
        .sub(tf.scalar(1.0));
      
      const predictions = await model.predict(tensor).data();
      
      const topPrediction = Array.from(predictions)
        .map((prob, index) => ({ probability: prob, index }))
        .sort((a, b) => b.probability - a.probability)[0];

      const confidence = (topPrediction.probability * 100).toFixed(1);
      const prompt = `I've analyzed a plant image with ${confidence}% confidence. What care tips would you recommend for this plant?`;
      
      updateChatHistory('assistant', `📸 I've analyzed your plant image (Confidence: ${confidence}%)`);
      handleSend(prompt);
    } catch (error) {
      console.error('Image processing error:', error);
      updateChatHistory('assistant', '❌ Sorry, we could not analyze the image. Please try again later.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        updateChatHistory('assistant', '❌ Please upload an image file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setSelectedImage(base64);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="chatbot-full-page">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h1>Plant Care Assistant</h1>
        </div>

        <div className="chatbot-messages">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              {message.image && (
                <div className="message-image">
                  <img src={message.image} alt="Uploaded plant" />
                </div>
              )}
              <div className="message-content">
                {message.message}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chatbot-input-container">
          <form onSubmit={handleTextSend} className="chatbot-input-form">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="chatbot-input"
            />
            <div className="chatbot-buttons">
              {isListening ? (
                <button
                  type="button"
                  onClick={stopListening}
                  className="voice-button stop-button"
                  title="Stop listening"
                >
                  <FaStop />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startListening}
                  className="voice-button"
                  title="Start voice input"
                >
                  <FaMicrophone />
                </button>
              )}
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="stop-voice-button active"
                  title="Stop speaking"
                >
                  <FaStop />
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="image-button" title="Upload image">
                <FaImage />
              </label>
              <button type="submit" className="send-button" title="Send message">
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
