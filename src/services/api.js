import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// Consistency Path CRUD operations
export const createConsistencyPath = (data) =>
  axios.post(`${BASE_URL}/paths`, data);
export const getConsistencyPaths = () => axios.get(`${BASE_URL}/paths`);
export const getConsistencyPath = (id) => axios.get(`${BASE_URL}/paths/${id}`);
export const updateConsistencyPath = (id, data) =>
  axios.put(`${BASE_URL}/paths/${id}`, data);
export const deleteConsistencyPath = (id) =>
  axios.delete(`${BASE_URL}/paths/${id}`);

// Checkpoint operations
export const addCheckpoint = (pathId, data) =>
  axios.post(`${BASE_URL}/paths/${pathId}/checkpoints`, data);
export const getCheckpoints = (pathId) =>
  axios.get(`${BASE_URL}/paths/${pathId}/checkpoints`);

// Auth operations (if needed later)
export const login = (data) => axios.post(`${BASE_URL}/auth/login`, data);
export const register = (data) => axios.post(`${BASE_URL}/auth/register`, data);
export const forgotPassword = (data) =>
  axios.post(`${BASE_URL}/auth/forgot-password`, data);
