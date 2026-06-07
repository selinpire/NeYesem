import axios from "axios";
import { API_BASE_URL } from "../config/app";
import { isAuthError } from "../utils/errors";

let accessToken: string | null = null;
let unauthorizedHandler: (() => void | Promise<void>) | null = null;
let handlingUnauthorized = false;

export function setApiToken(token: string | null) {
  accessToken = token;
}

export function setUnauthorizedHandler(handler: (() => void | Promise<void>) | null) {
  unauthorizedHandler = handler;
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isAuthError(error) && unauthorizedHandler && !handlingUnauthorized) {
      handlingUnauthorized = true;
      try {
        await unauthorizedHandler();
      } finally {
        handlingUnauthorized = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
