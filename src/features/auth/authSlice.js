// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosInstance";


// دالة لفك التوكن
const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (err) {
        console.log(err);
        localStorage.removeItem("token");
        return null;
    }
};

// جلب بيانات المستخدم الكاملة
export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("auth/me"); // أو /users/me
            return response.data; // { name: "أحمد محمد", email: "...", avatar: "...", ... }
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const initialState = {
    token: localStorage.getItem("token") || null,
    claims: decodeToken(localStorage.getItem("token")), // role + permissions + id
    profile: null,        // الداتا الكاملة: name, avatar, email ...
    loading: false,
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
            state.claims = decodeToken(token);
            state.profile = null; // نعيد تحميل الـ profile
        },
        logout: (state) => {
            localStorage.removeItem("token");
            state.token = null;
            state.claims = null;
            state.profile = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "فشل تحميل بيانات المستخدم";
                // لو التوكن منتهي → logout تلقائي
                if (action.payload?.status === 401) {
                    localStorage.removeItem("token");
                    state.token = null;
                    state.claims = null;
                }
            });
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;