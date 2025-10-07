/**
 * A centralized API service module for interacting with the patient backend endpoints.
 * This file uses a pre-configured Axios instance to handle all HTTP requests and includes standardized error handling for patient-related CRUD operations.
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getAllPatients = async (searchTerm = '', statusFilter = 'All') => {
  try {
    const params = {};
    
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm.trim();
    }
    
    if (statusFilter && statusFilter !== 'All') {
      params.status = statusFilter;
    }

    const response = await api.get('/patients', { params });
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch patients';
    throw new Error(errorMessage);
  }
};

export const getPatientById = async (id) => {
  try {
    const response = await api.get(`/patients/${id}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    const errorMessage = error.response?.data?.message || 'Failed to fetch patient';
    throw new Error(errorMessage);
  }
};

export const createPatient = async (patientData) => {
  try {
    const response = await api.post('/patients', patientData);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      const errors = error.response.data.errors.join(', ');
      throw new Error(errors);
    }
    const errorMessage = error.response?.data?.message || 'Failed to create patient';
    throw new Error(errorMessage);
  }
};

export const updatePatient = async (id, patientData) => {
  try {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    if (error.response?.status === 400 && error.response?.data?.errors) {
      const errors = error.response.data.errors.join(', ');
      throw new Error(errors);
    }
    const errorMessage = error.response?.data?.message || 'Failed to update patient';
    throw new Error(errorMessage);
  }
};

export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`/patients/${id}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    const errorMessage = error.response?.data?.message || 'Failed to delete patient';
    throw new Error(errorMessage);
  }
};

const patientService = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
export default patientService;