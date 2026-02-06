import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;


export async function savePayment(data, token) {
    try {
        const res = await axios.post(`${apiUrl}/payment/savePayment`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (e) {
        console.error("Error");
    }

}