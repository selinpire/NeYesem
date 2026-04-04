import axios from "axios";

const api = axios.create({
  baseURL: "https://ne-yesem-amber.vercel.app/",
});

export default api;