// src/api/userAPI.ts
import axios from './axiosConfig';

interface UserData {
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'inventory';
  password?: string; // optional when updating
}

// GET all users (protected)
export const getUsers = async (token: string) => {
  const response = await axios.get('/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// GET a single user by ID (protected)
export const getUserById = async (id: string, token: string) => {
  const response = await axios.get(`/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// CREATE a new user (protected)


const API = axios.create({
  baseURL: 'http://192.168.170.110:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const addUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await API.post('/api/users', userData);
  return response.data;
};

// UPDATE user by ID (protected)
export const updateUser = async (id: string, userData: Partial<UserData>, token: string) => {
  const response = await axios.put(`/api/users/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// DELETE user by ID (protected)
export const deleteUser = async (id: string, token: string) => {
  const response = await axios.delete(`/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
