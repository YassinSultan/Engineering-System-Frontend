import api from "./axiosInstance";

export const createProtocol = async (formData) => {
    const response = await api.post("/protocols", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateProtocol = async ({ id, formData }) => {
    const res = await api.patch(`/protocols/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const updateImplementationRate = async ({ id, data }) => {
    const res = await api.patch(`/protocols/${id}/implementation-rate`, data);
    return res.data;
};