import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const uploadImage = async (formData) => {
  return await axios.post(`${API_URL}/upload`, formData);
};