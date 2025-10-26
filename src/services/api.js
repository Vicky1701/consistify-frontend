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

// Enhanced Checkpoint CRUD operations
export const createCheckpoint = (data) =>
  axios.post(`${BASE_URL}/checkpoints`, data);
export const getAllCheckpoints = (params = {}) =>
  axios.get(`${BASE_URL}/checkpoints`, { params });
export const getCheckpoint = (id) => axios.get(`${BASE_URL}/checkpoints/${id}`);
export const updateCheckpoint = (id, data) =>
  axios.put(`${BASE_URL}/checkpoints/${id}`, data);
export const deleteCheckpoint = (id) =>
  axios.delete(`${BASE_URL}/checkpoints/${id}`);

// Get checkpoints by consistency path
export const getCheckpointsByPath = (pathId) =>
  axios.get(`${BASE_URL}/checkpoints/path/${pathId}`);

// Code Solution operations
export const addCodeSolution = (checkpointId, data) =>
  axios.post(`${BASE_URL}/checkpoints/${checkpointId}/solutions`, data);
export const getCodeSolutions = (checkpointId) =>
  axios.get(`${BASE_URL}/checkpoints/${checkpointId}/solutions`);

// Search and Filter operations
export const searchCheckpoints = (query) =>
  axios.get(`${BASE_URL}/checkpoints/search`, { params: { q: query } });
export const filterCheckpoints = (filters) =>
  axios.get(`${BASE_URL}/checkpoints/filter`, { params: filters });
export const getCheckpointsByTag = (tag) =>
  axios.get(`${BASE_URL}/checkpoints/filter`, { params: { tag } });
export const getCheckpointsByDifficulty = (difficulty) =>
  axios.get(`${BASE_URL}/checkpoints/filter`, { params: { difficulty } });
export const getCheckpointsByStatus = (status) =>
  axios.get(`${BASE_URL}/checkpoints/filter`, { params: { status } });

// Auth operations (if needed later)
export const login = (data) => axios.post(`${BASE_URL}/auth/login`, data);
export const register = (data) => axios.post(`${BASE_URL}/auth/register`, data);
export const forgotPassword = (data) =>
  axios.post(`${BASE_URL}/auth/forgot-password`, data);
