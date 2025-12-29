import api from "./axiosInstance";


export const createProject = async ({ data }) => {
    const response = await api.post("/projects", data, {
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

export const getProject = async (id, filters) => {
    const res = await api.get(`/projects/${id}`, { params: filters });
    return res.data;
};

export const updateProject = async ({ id, data }) => {
    const res = await api.patch(`/projects/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};