import api from "./axiosInstance";

export const createContractPerrmission = async ({ id, formData }) => {
    const response = await api.post(`/projects/${id}/contract-permissions`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
export const updateContractPerrmission = async ({ projectID, contractID, formData }) => {
    const response = await api.patch(`/projects/${projectID}/contract-permissions/${contractID}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};