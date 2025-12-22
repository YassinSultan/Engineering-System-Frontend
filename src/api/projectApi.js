import api from "./axiosInstance";


export const createProject = async (formData) => {
    const response = await api.post("/projects", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};