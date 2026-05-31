import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 12000,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const getApiError = (error) =>
  error?.response?.data?.message || 'Network issue. Please try again.';
