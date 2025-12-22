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

  createProduct: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/products`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
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

  createPortfolioItem: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/portfolio`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      throw error;
    }
  },

  updatePortfolioItem: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/portfolio/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  },

  deletePortfolioItem: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/portfolio/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
  },

  // Custom Pages
  getPages: async () => {
    try {
      const response = await axios.get(`${API_URL}/pages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  },

  getPublishedPages: async () => {
    try {
      const response = await axios.get(`${API_URL}/pages/published`);
      return response.data;
    } catch (error) {
      console.error('Error fetching published pages:', error);
      return [];
    }
  },

  getPage: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/pages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  },

  getPageBySlug: async (slug) => {
    try {
      const response = await axios.get(`${API_URL}/pages/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      throw error;
    }
  },

  createPage: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/pages`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  },

  updatePage: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/pages/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  },

  deletePage: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/pages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  },

  // Site Settings
  getSettings: async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  },

  updateSettings: async (data) => {
    try {
      const response = await axios.put(`${API_URL}/settings`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
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

  getContacts: async () => {
    try {
      const response = await axios.get(`${API_URL}/contact`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
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
  createPayment: async (orderId) => {
    try {
      const response = await axios.post(`${API_URL}/orders/${orderId}/create-payment`);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

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
