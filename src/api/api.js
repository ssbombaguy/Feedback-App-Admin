import axios from "axios";

const BASE_URL = "https://test.registration-mziuri.ge/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = {
  login: (email, password) => api.post("/admin/login", { email, password }),

  getFeedbacks: () => api.get("/feedbacks").then(res => res.data.data || res.data),
  
  deleteFeedback: (id) => api.delete(`/feedbacks/${id}`),
  
  getUser: () => api.get("/user").then(res => res.data),

  sendNotification: (notificationData) => api.post('/notifications/send', notificationData),

  getPupils: () => api.get('/pupils/logged-in').then(res => res.data),
};