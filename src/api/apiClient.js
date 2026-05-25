import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({ baseURL: BACKEND_URL, withCredentials: true });

export default apiClient;
