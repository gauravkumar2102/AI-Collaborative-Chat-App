import axios from 'axios';


const AxiosIntance=axios.create({
     baseURL:import.meta.env.VITE_API_URL,
     withCredentials: true, // Enable sending cookies with requests
}) 

AxiosIntance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default AxiosIntance;