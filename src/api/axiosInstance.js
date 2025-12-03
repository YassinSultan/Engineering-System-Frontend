import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:10000/api",
    withCredentials: false, // لو API بتستخدم cookies
    timeout: 10000, // 10 ثواني
});

export default api;