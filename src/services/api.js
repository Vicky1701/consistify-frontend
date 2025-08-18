import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const createConsistencyPath = (data) => axios.post(`${BASE_URL}/paths`, data);
export const getConsistencyPaths = () => axios.get(`${BASE_URL}/paths`);
export const addCheckpoint = (pathId, data) => axios.post(`${BASE_URL}/paths/${pathId}/checkpoints`, data);
export const getCheckpoints = (pathId) => axios.get(`${BASE_URL}/paths/${pathId}/checkpoints`);
