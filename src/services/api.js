import axios from 'axios';

// Base URL for your API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://machine-learning-okod.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Service Object
const apiService = {
  // Get all notes/notebooks
  getAllNotes: async () => {
    try {
      const response = await api.get('/markdown');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single note by ID
  getNoteById: async (id) => {
    try {
      const response = await api.get(`/markdown/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new note (Admin only)
  createNote: async (noteData) => {
    try {
      const response = await api.post('/markdown', noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update existing note (Admin only)
  updateNote: async (id, noteData) => {
    try {
      const response = await api.put(`/markdown/${id}`, noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete note (Admin only)
  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/markdown/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search notes
  searchNotes: async (query) => {
    try {
      const response = await api.get(`/markdown/search/${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default apiService;