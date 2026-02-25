import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as CartService from "../../service/Cart/CartService";

// Fetch Cart
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, thunkAPI) => {
        const token = thunkAPI.getState().auth?.account?.token;
        if (!token) return { items: [] };
        const data = await CartService.getCartForUser(token);
        return data || { items: [] };
    }
);

// Add to Cart
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ id, size, quantity }, thunkAPI) => {
        const token = thunkAPI.getState().auth?.account?.token;
        if (!token) throw new Error("Not authenticated");
        // API expects productId
        const data = await CartService.addItemToCart(token, id, size, quantity);
        return data;
    }
);

// Update Quantity
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ cartItemId, quantity }, thunkAPI) => {
        const token = thunkAPI.getState().auth?.account?.token;
        if (!token) throw new Error("Not authenticated");
        const data = await CartService.updateItemQuantity(token, cartItemId, quantity);
        return data;
    }
);

// Remove Item
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (cartItemId, thunkAPI) => {
        const token = thunkAPI.getState().auth?.account?.token;
        if (!token) throw new Error("Not authenticated");
        const data = await CartService.removeItemFromCart(token, cartItemId);
        return data;
    }
);

// Clear Cart
export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, thunkAPI) => {
        const token = thunkAPI.getState().auth?.account?.token;
        if (!token) throw new Error("Not authenticated");
        await CartService.clearCart(token);
        return { items: [] };
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        totalPrice: 0,
        status: 'idle',
        error: null
    },
    reducers: {
        // Reducer synchronous clear (optional on logout)
        resetCartState: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCart.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items || [];
                state.totalPrice = action.payload.totalPrice || 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Add
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.totalPrice = action.payload.totalPrice || 0;
            })
            // Update
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.totalPrice = action.payload.totalPrice || 0;
            })
            // Remove
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.totalPrice = action.payload.totalPrice || 0;
            })
            // Clear
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.totalPrice = 0;
            });
    }
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
