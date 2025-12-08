import api from "./axiosInstance";

export const updateProfile = async (data) => {
    const res = await api.patch(`/profile`, data, {
        headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
};
export const changePassword = async (data) => {
    const res = await api.patch("/profile/change-password", data);
    return res.data;
};