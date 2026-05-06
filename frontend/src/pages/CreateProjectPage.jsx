import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../api/projectApi";
import "../pages/Auth.css"; // Reuse auth styles for consistency

export default function CreateProjectPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      setLoading(true);
      await createProject({ name: name.trim(), description: description.trim() });
      alert("Project created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error creating project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create New Project</h2>
        <p>Start a new project and invite your team members</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>

          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}