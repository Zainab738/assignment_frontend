// src/api.js
import axios from "axios";

// Axios instance for user routes
export const userApi = axios.create({
  baseURL: "http://localhost:3000/route",
});

// Axios instance for post routes
export const postApi = axios.create({
  baseURL: "http://localhost:3000/posts",
});

// Log every request
const logRequest = (config) => {
  console.log(
    "➡️ API Request:",
    config.method?.toUpperCase(),
    config.baseURL + config.url,
    config.data || ""
  );
  return config;
};

// Log every response
const logResponse = (response) => {
  console.log("✅ API Response:", response.data);
  return response;
};

const logError = (error) => {
  console.error("❌ API Error:", error.response?.data || error.message);
  return Promise.reject(error);
};

// Attach interceptors
userApi.interceptors.request.use(logRequest);
userApi.interceptors.response.use(logResponse, logError);

postApi.interceptors.request.use(logRequest);
postApi.interceptors.response.use(logResponse, logError);

export default { userApi, postApi };
