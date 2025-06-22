// src/api/dashboardAPI.ts
import axios from './axiosConfig'; // Use your configured axios instance

export const getAdminDashboard = async () => {
  const response = await axios.get('/dashboard/admin');
  return response.data;
};

export const getCashierDashboard = async () => {
  const response = await axios.get('/dashboard/cashier');
  return response.data;
};

export const getInventoryDashboard = async () => {
  const response = await axios.get('/dashboard/inventory');
  return response.data;
};