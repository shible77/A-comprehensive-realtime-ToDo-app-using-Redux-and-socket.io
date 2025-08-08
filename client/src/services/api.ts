import axios from "axios";

const api = axios.create({
  baseURL: "https://a-realtime-to-do-app.onrender.com/api",
  withCredentials: true,
});

export default api;
