/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Base API URL - Update this based on your backend server
export const API_BASE_URL = 'http://localhost';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  SIGNIN: `${API_BASE_URL}/signin.php`,
  SIGNUP: `${API_BASE_URL}/signup.php`,
  LOGOUT: `${API_BASE_URL}/logout.php`,
  
  // User Profile
  USER_PROFILE: `${API_BASE_URL}/userprofile.php`,
  
  // Exam Management
  TAKE_EXAM: `${API_BASE_URL}/takeExam.php`,
  
  // Add more endpoints as needed
};

// Default fetch options
export const DEFAULT_FETCH_OPTIONS = {
  credentials: 'include', // Include cookies/session
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Helper function to make API requests
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data
 */
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      ...options,
      headers: {
        ...DEFAULT_FETCH_OPTIONS.headers,
        ...(options.headers || {}),
      },
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
