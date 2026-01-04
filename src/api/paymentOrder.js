import api from "./axiosInstance";

export const createPaymentOrder = async (data) => {
    const response = await api.post("/payment-order", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updatePaymentOrder = async ({ id, data }) => {
    const res = await api.patch(`/payment-order/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const deletePaymentOrder = async (id) => {
    const res = await api.delete(`/payment-order/${id}`);
    return res.data;
};