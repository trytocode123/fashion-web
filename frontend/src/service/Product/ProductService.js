import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function getTop8Trailer() {
    try {
        const res = await axios.get(`${apiUrl}/products/top8Trailer`);
        return res.data;

    } catch (e) {
        console.error(e.message);
    }
}

export async function findProductById(id, token) {

    try {
        const res = await axios.get(`${apiUrl}/products/detail/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (e) {
        console.error(e.message);
    }
}

export async function findProductByName(name, token) {
    try {
        const res = await axios.get(`${apiUrl}/products/product-by-name/${name}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        return res.data;

    } catch (e) {
        console.error(e.message);
    }
}