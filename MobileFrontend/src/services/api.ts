import axios from "axios";
import { API_BASE_URL } from "../config/app";

let accessToken: string | null = null;

export function setApiToken(token: string | null) {
  accessToken = token;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
