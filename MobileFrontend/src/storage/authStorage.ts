import * as SecureStore from "expo-secure-store";
import { UserSummary } from "../types";

const TOKEN_KEY = "neyesem_token";
const USER_KEY = "neyesem_user";

export async function saveSession(token: string, user: UserSummary) {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
  ]);
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}

export async function getStoredSession() {
  const [token, rawUser] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(USER_KEY),
  ]);

  if (!token || !rawUser) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser) as UserSummary;
    return { token, user };
  } catch {
    return null;
  }
}
