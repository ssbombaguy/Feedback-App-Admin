import axios from "axios";

const BASE_URL = "https://test.registration-mziuri.ge/api/v1" ;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};


export const login = (email, password) => {
  return axios.post(`${BASE_URL}/login`, { email, password });
};

export const getFeedbacks = () => {
  return axios.get(`${BASE_URL}/feedbacks`, {
    headers: getAuthHeaders(),
  });
};

export const deleteFeedback = (id) => {
  return axios.delete(`${BASE_URL}/feedbacks/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const getUser = () => {
  return axios.get(`${BASE_URL}/user`, {
    headers: getAuthHeaders(),
  });
};