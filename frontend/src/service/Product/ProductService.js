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
        const res = await axios.get(`${apiUrl}/products/search?name=${name}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;

    } catch (e) {
        console.error(e.message);
    }
}

export async function findAllProduct(token, page = 0, size = 9) {
    try {
        const res = await axios.get(`${apiUrl}/products?page=${page}&size=${size}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        return res.data;

    } catch (e) {
        console.error(e.message);
    }
}

export async function filterProducts(token, filters, page = 0, size = 9) {
    try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("size", size);

        if (filters.categories && filters.categories.length > 0) {
            filters.categories.forEach(c => params.append("categories", c));
        }
        if (filters.genders && filters.genders.length > 0) {
            filters.genders.forEach(g => params.append("genders", g));
        }
        if (filters.sizes && filters.sizes.length > 0) {
            filters.sizes.forEach(s => params.append("sizes", s));
        }
        if (filters.minPrice !== undefined && filters.minPrice > 0) {
            params.append("minPrice", filters.minPrice);
        }
        if (filters.maxPrice !== undefined && filters.maxPrice < 400000) {
            params.append("maxPrice", filters.maxPrice);
        }

        const res = await axios.get(`${apiUrl}/products/filter`, {
            params,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;

    } catch (e) {
        console.error(e.message);
    }
}