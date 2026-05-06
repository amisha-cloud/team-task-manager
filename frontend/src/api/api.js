import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is required. Set it to your Render backend URL.");
}

const normalizedBaseUrl = API_BASE_URL
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

const API = axios.create({
  baseURL: `${normalizedBaseUrl}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
