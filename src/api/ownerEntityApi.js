import api from "./axiosInstance";

export const getOwnerEntity = async (filters) => {
    const res = await api.get("/owner-entity", { params: filters });
    return res;
};
export const createOwnerEntity = async (data) => {
    const response = await api.post("/owner-entity", data);
    return response;
};