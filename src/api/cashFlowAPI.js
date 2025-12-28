import api from "./axiosInstance";

export const createCashFlow = async (data) => {
    const response = await api.post("/cash-flow", data);
    return response.data;
};

export const updateCashFlow = async ({ id, data }) => {
    const res = await api.patch(`/cash-flow/${id}`, data);
    return res.data;
};

export const deleteCashFlow = async (id) => {
    const res = await api.delete(`/cash-flow/${id}`);
    return res.data;
};