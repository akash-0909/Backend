import axios from "axios";

const api = axios.create({
    baseURL: "https://mytube-0z6x.onrender.com/api/v1",
    withCredentials: true
});

export default api;