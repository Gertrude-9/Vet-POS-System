// src/api/authApi.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.170.110:5000", // your backend IP and port
  headers: {
    "Content-Type": "application/json",
  },
});

// Define expected response structure for login
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: UserData;
}

// Modified authApi.ts with better error logging
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    console.log("Attempting login to:", `${API.defaults.baseURL}/api/login`);
    const response = await API.post<LoginResponse>("/api/login", { email, password });
    console.log("Login response:", response);
    return response.data;
  } catch (error: any) {
    console.error("Full error object:", error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("No response from server. Check network connection.");
    } else {
      // Something happened in setting up the request
      console.error("Request setup error:", error.message);
      throw new Error("Request setup failed");
    }
  }
};
export default API;
