// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { normalizePermissions } from "../../utils/permission.utils"; // Import the utility

// جلب بيانات المستخدم الكاملة
export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/auth/me");
            return res.data.data; // user object
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const initialState = {
    token: localStorage.getItem("token"),
    user: null,        // كل بيانات المستخدم + permissions
    loading: false,
    initialized: false, // مهم جدًا
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token } = action.payload;
            localStorage.setItem("token", token);
            state.token = token;
            state.user = null;
            state.initialized = false;
        },
        logout: (state) => {
            localStorage.removeItem("token");
            state.token = null;
            state.user = null;
            state.initialized = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                const userData = action.payload;
                state.user = {
                    ...userData,
                    permissions: normalizePermissions(userData.permissions), // Normalize permissions here
                };
                state.initialized = true;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                state.initialized = true;

                if (action.payload?.status === 401) {
                    localStorage.removeItem("token");
                    state.token = null;
                    state.user = null;
                }
            });
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;