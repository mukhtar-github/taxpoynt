import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.example.com/',
});

// Request Interceptor
instance.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request;
});

// Response Interceptor
instance.interceptors.response.use(response => {
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response;
}, error => {
    if (error.response) {
        console.error('Error:', error.response);
    } else {
        console.error('Error:', error.message);
    }
    return Promise.reject(error);
});

export default instance;