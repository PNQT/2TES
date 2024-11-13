import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set the Authorization header with the token
const token = 'null'; // Replace with the actual token
window.axios.defaults.headers.common['Authorization'] = token;