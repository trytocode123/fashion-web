import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function savePayment(data, token, productId = null, size = null, quantity = null) {
    try {
        let url = `${apiUrl}/payment/savePayment/${data}`;
        const params = new URLSearchParams();
        if (productId) params.append('productId', productId);
        if (size) params.append('size', size);
        if (quantity) params.append('quantity', quantity);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (e) {
        console.error(e.message);
    }
}