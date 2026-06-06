import Constants from "expo-constants";

const PROD_API_URL = "https://ne-yesem-amber.vercel.app/api";
const LOCAL_API_PORT = 3000;

function getDevHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(":")[0];
  }

  const debuggerHost = (Constants as { manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } } })
    .manifest2?.extra?.expoGo?.debuggerHost;
  if (debuggerHost) {
    return debuggerHost.split(":")[0];
  }

  return null;
}

function resolveApiBaseUrl(): string {
  if (!__DEV__) {
    return PROD_API_URL;
  }

  const devHost = getDevHost();
  if (devHost) {
    return `http://${devHost}:${LOCAL_API_PORT}/api`;
  }

  return `http://localhost:${LOCAL_API_PORT}/api`;
}

export const APP_NAME = "NeYesem";
export const API_BASE_URL = resolveApiBaseUrl();
export const FEATURED_COUNT = 6;
