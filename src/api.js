// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/route", // backend base
});

// log every request
api.interceptors.request.use((config) => {
  console.log(
    "➡️ API Request:",
    config.method?.toUpperCase(),
    config.url,
    config.data || ""
  );
  return config;
});

// log every response
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
