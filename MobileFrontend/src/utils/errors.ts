import axios from "axios";

const AUTH_SKIP_PATHS = ["/auth/login", "/auth/register"];

export function isAuthError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  const message = error.response?.data?.message;
  const requestUrl = error.config?.url || "";

  if (AUTH_SKIP_PATHS.some((path) => requestUrl.includes(path))) {
    return false;
  }

  if (status === 401) {
    return true;
  }

  if (typeof message === "string") {
    const normalized = message.toLocaleLowerCase("tr-TR");
    return (
      normalized.includes("geçersiz token") ||
      normalized.includes("gecersiz token") ||
      normalized.includes("token gerekli")
    );
  }

  return false;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Bir hata olustu."
) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
