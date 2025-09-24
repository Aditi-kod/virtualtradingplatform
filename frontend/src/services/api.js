import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api"
});
api.interceptors.request.use(cfg => {
    const token = localStorage.getItem("token");
    if(token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});
// Global response handler: on 401 remove token and redirect to login
api.interceptors.response.use(
    res => res,
    err => {
        if(err?.response?.status === 401){
            try{ localStorage.removeItem("token"); }catch(e){}
            // browser navigation - keep it simple so this file doesn't depend on react-router
            if(window.location.pathname !== '/login') window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);
export default api;
