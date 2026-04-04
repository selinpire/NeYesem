import axios from "axios";

const api = axios.create({
  baseURL: "https://ne-yesem-amber.vercel.app/api",
});

export default api;