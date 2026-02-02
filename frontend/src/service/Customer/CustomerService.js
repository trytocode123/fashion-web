import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function findByEmail(account) {
    try {
        const res = await axios.post(`${apiUrl}/login`, account);
        return res.data;
    } catch (e) {
        return {
            message: e.response.data,
        };
    }
}