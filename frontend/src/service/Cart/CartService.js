import axios from "axios";

const CART_API_URL = "http://localhost:8080/v1/api/cart";

const getConfig = (token) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getCartForUser = async (token) => {
    try {
        const res = await axios.get(CART_API_URL, getConfig(token));
        return res.data;
    } catch (e) {
        console.error("Error fetching cart", e);
        return null; // Return null if fetching fails
    }
};

export const addItemToCart = async (token, productId, size, quantity) => {
    try {
        const res = await axios.post(`${CART_API_URL}/add`, null, {
            ...getConfig(token),
            params: { productId, size, quantity }
        });
        return res.data;
    } catch (e) {
        console.error("Error adding to cart", e);
        throw e;
    }
};

export const updateItemQuantity = async (token, cartItemId, quantity) => {
    try {
        const res = await axios.put(`${CART_API_URL}/update`, null, {
            ...getConfig(token),
            params: { cartItemId, quantity }
        });
        return res.data;
    } catch (e) {
        console.error("Error updating cart quantity", e);
        throw e;
    }
};

export const removeItemFromCart = async (token, cartItemId) => {
    try {
        const res = await axios.delete(`${CART_API_URL}/remove/${cartItemId}`, getConfig(token));
        return res.data;
    } catch (e) {
        console.error("Error removing cart item", e);
        throw e;
    }
};

export const clearCart = async (token) => {
    try {
        const res = await axios.delete(`${CART_API_URL}/clear`, getConfig(token));
        return res.status === 200;
    } catch (e) {
        console.error("Error clearing cart", e);
        throw e;
    }
};
