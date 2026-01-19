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
export const getProjectsOptions = async (filters) => {
    const res = await api.get("/projects/options", { params: filters });
    return res;
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
export const updatePresentationFile = async ({ id, formData }) => {
    const res = await api.patch(`/projects/${id}/presentation-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};
export const updateAerialPhotographyFile = async ({ id, formData }) => {
    const res = await api.patch(`/projects/${id}/aerial-photography-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};
