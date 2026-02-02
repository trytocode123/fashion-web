import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        account: null
    },

    reducers: {
        loginSuccess: (state, action) => {
            state.account = action.payload
        },
        logOut: (state) => {
            state.account = null;
        },
        logInByGoogle: (state, action) => {
            state.account = action.payload;
        }
    }
})

export const {loginSuccess, logOut, logInByGoogle} = authSlice.actions;
export default authSlice.reducer;