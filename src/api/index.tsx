import axios, { AxiosInstance } from 'axios';
// import { BASE_URL_BE } from '../constant/url';

const Api: AxiosInstance = axios.create({
    // set default endpoint API
    baseURL: "https://back-bursopuri.vercel.app/",
    headers: {
        'Content-Type': 'application/json', // Pastikan Content-Type sudah benar
    }
});

export default Api;