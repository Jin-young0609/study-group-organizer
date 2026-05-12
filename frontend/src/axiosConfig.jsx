import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
baseURL: 'http://15.134.145.245', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
