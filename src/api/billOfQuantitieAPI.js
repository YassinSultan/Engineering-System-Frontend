import api from "./axiosInstance";

export const createBillOfQuantitie = async ({ data }) => {
    const response = await api.post("/bill-of-quantitie", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
export const getBillOfQuantities = async (filters) => {
    const res = await api.get("/bill-of-quantitie", { params: filters });
    return res.data;
};
export const getBillOfQuantitie = async (id, filters) => {
    const res = await api.get(`/bill-of-quantitie/${id}`, { params: filters });
    return res.data;
};
export const updateBillOfQuantitie = async ({ id, data }) => {
    const res = await api.patch(`/bill-of-quantitie/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};