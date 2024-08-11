import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.example.com/',
    // other configurations
});

instance.interceptors.response.use(response => response, error => {
    // Handle errors
    console.error('API Error:', error);
    throw error;
});

export default instance;