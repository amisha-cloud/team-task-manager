import { useEffect, useState } from "react";
import { getProjects, createProject } from "../api/projectApi";
import { useNavigate } from "react-router-dom";

export default function Project() {
  const [name, setName] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const res = await getProjects();
    setProjects(res.data);
  };

  const handleCreate = async () => {
    if (!name) return alert("Enter project name");
    await createProject({ name });
    setName("");
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h2>Projects</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
      />
      <button onClick={handleCreate}>Create</button>

      <hr />

      {projects.map((p) => (
        <div key={p.id}>
          <h4>{p.name}</h4>
          <button onClick={() => navigate(`/project/${p.id}`)}>
            Open
          </button>
        </div>
      ))}
    </div>
  );
}