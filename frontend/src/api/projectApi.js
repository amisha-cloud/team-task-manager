import API from "./api";

export const getProjects = () => API.get("/projects");
export const createProject = (data) => API.post("/projects", data);
export const getProjectMembers = (projectId) =>
  API.get(`/projects/${projectId}/members`);
export const addMember = (projectId, email) =>
  API.post(`/projects/${projectId}/members`, { email });
export const removeMember = (projectId, userId) =>
  API.delete(`/projects/${projectId}/members/${userId}`);
