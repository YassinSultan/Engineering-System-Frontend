import api from "./axiosInstance";

export const createPlanningBudget = async (formData) => {
    const response = await api.post("/planning-budget", formData);
    return response.data;
};

export const updatePlanningBudget = async ({ id, data }) => {
    const res = await api.patch(`/planning-budget/${id}`, data);
    return res.data;
};