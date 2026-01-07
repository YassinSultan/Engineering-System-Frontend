import api from "./axiosInstance";

export const createEstimatedCost = async ({ id, formData }) => {
    const response = await api.post(`/projects/${id}/estimated-costs`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
export const updateEstimatedCost = async ({ projectID, estimatedCostId, formData }) => {
    const response = await api.patch(`/projects/${projectID}/estimated-costs/${estimatedCostId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};