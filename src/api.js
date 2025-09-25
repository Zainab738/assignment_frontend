import axios from "axios";

export const postApi = axios.create({
  baseURL: "http://localhost:3000/posts",
});

export const userApi = axios.create({
  baseURL: "http://localhost:3000/users",
});

// attach token to every postApi request
postApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// attach token to every userApi request too
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
