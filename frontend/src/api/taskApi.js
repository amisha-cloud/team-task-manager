import API from "./api";

export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, status) =>
  API.put(`/tasks/${id}`, { status });