import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;


export async function savePayment(data, token) {
    console.log(token)
    try {
        const res = await axios.get(`${apiUrl}/payment/savePayment/${data}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (e) {
        console.error(e.message);
    }
}