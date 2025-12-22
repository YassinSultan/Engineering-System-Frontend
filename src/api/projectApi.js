import api from "./axiosInstance";


export const createProject = async (formData) => {
    const response = await api.post("/projects", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
export const getProjects = async (filters) => {
    const res = await api.get("/projects", { params: filters });
    return res.data;
};