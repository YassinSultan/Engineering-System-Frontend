import api from "./axiosInstance";

export const getCompanies = async (filters) => {
    const res = await api.get("/companies", { params: filters });
    return res.data;
};
export const suggestionFilter = async (field, search) => {
    const res = await api.get(`/companies/filter/${field}`, { params: search });
    return res.data;
};