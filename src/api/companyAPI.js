import api from "./axiosInstance";

export const getCompanies = async (filters) => {
    const res = await api.get("/companies", { params: filters });
    return res.data;
};
export const getCompany = async (filters) => {
    const res = await api.get(`/companies/${filters.id}`, { params: filters });
    return res;
};
export const suggestionFilter = async (field, search) => {
    const res = await api.get(`/companies/filter/${field}`, { params: search });
    return res.data;
};
export const createCompany = async (formData) => {
    const response = await api.post("/companies", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateCompanyAPI = async ({ id, formData }) => {
    const res = await api.patch(`/companies/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const deleteCompany = async (id) => {
    const res = await api.delete(`/companies/${id}`);
    return res.data;
};