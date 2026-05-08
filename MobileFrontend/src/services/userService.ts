import api from "./api";
import { ProfileUpdatePayload, ProfileUpdateResponse, UserProfile } from "../types";

export async function getProfile(userId: string) {
  const response = await api.get<UserProfile>(`/users/${userId}`);
  return response.data;
}

export async function updateProfile(userId: string, payload: ProfileUpdatePayload) {
  const response = await api.put<ProfileUpdateResponse>(`/users/${userId}`, payload);
  return response.data;
}

export async function deleteAccount(userId: string) {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
}
