import api from "./axiosInstance";

export const createFinancialAllocation = async ({ id, formData }) => {
    const response = await api.post(`/projects/${id}/financial-allocations`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
export const updateFinancialAllocation = async ({ projectID, financialAllocationId, formData }) => {
    const response = await api.patch(`/projects/${projectID}/financial-allocations/${financialAllocationId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};