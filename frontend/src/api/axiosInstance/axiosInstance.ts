import axios from "axios";

const axiosInstance = axios.create({
    //@ts-ignore
    baseURL: import.meta.env.VITE_APP_BACKEND,
    headers: {
        "Content-Type": "application/json"
    },
})

export default axiosInstance