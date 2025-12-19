import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api`;

// API client for CBKS77
export const api = {
  // Products
  getProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Portfolio
  getPortfolio: async () => {
    try {
      const response = await axios.get(`${API_URL}/portfolio`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  },

  getPortfolioItem: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/portfolio/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      throw error;
    }
  },

  // Contact
  submitContact: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/contact`, data);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Orders
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getOrder: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // PayPal
  capturePayment: async (orderId, paypalOrderId) => {
    try {
      const response = await axios.post(`${API_URL}/orders/${orderId}/capture`, {
        paypalOrderId
      });
      return response.data;
    } catch (error) {
      console.error('Error capturing payment:', error);
      throw error;
    }
  }
};

export default api;