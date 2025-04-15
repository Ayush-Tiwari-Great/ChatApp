import axios from 'axios'

const api = axios.create({
  baseURL: "https://chatapp-3ugb.onrender.com",
  withCredentials: true,
});

export default api;