import axios from "axios";

export const postApi = axios.create({
  baseURL: "http://localhost:3000/posts", // change if your backend is on another port
});

export const userApi = axios.create({
  baseURL: "http://localhost:3000/users",
});

// add token to every request automatically
postApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // get saved token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // attach it
  }
  return config;
});
