import api from "./api";
import { AuthResponse } from "../types";

export async function loginUser(email: string, password: string) {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
}

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const response = await api.post<AuthResponse>("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
}
