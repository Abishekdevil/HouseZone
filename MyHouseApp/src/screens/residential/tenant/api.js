// API functions for tenant data
// Use localhost as default, but allow override via environment variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Helper function to handle fetch requests
const handleFetchRequest = async (url, options) => {
  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    if (error.message.includes('Network request failed')) {
      throw new Error('Network connection failed. Please check your internet connection.');
    }
    throw error;
  }
};

// Get all residential properties for tenant view
export const getAllProperties = async () => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/residential/properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error(`Failed to fetch properties: ${error.message || 'Network error'}`);
  }
};

// Get detailed residential property information
export const getPropertyDetails = async (id) => {
  try {
    const result = await handleFetchRequest(`${API_BASE_URL}/residential/properties/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw new Error(`Failed to fetch property details: ${error.message || 'Network error'}`);
  }
};