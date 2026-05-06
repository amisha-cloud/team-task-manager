import { useState } from "react";
import { createProject } from "../../api/projectApi";

export default function CreateProject({ refresh }) {
  const [name, setName] = useState("");

  const handle = async () => {
    await createProject({ name });
    setName("");
    refresh();
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handle}>Create</button>
    </div>
  );
}