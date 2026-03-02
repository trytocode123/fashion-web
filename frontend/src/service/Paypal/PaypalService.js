import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function progressPaypal(amount, token, productId = null, size = null, quantity = null) {
    try {
        const payload = { amount: amount };
        if (productId) {
            payload.productId = productId;
            payload.size = size;
            payload.quantity = quantity;
        }

        const res = await axios.post(`${apiUrl}/paypal/save-paypal`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;

    } catch (e) {
        console.error(e.message);
    }
}

export async function paypalSuccess(paymentId, payerID) {
    try {
        const res = await axios.get(`${apiUrl}/paypal/success/${paymentId}/${payerID}`);
        console.log(res)
        return res.data;
    } catch (e) {
        console.error(e.message);
    }
}