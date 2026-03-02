import axios from "axios";
import {store} from "../redux/Store/store.js";


const apiUrl = import.meta.env.VITE_API_BASE_URL;
const axiosClient = axios.create({
    baseURL: `${apiUrl}`,
    withCredentials: true
});

// 🔹 Request interceptor: Gắn access token
axiosClient.interceptors.request.use(
    (config) => {
        const token = store.getState().auth?.account?.token;

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosClient;