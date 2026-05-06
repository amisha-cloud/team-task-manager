import { useParams, useNavigate } from "react-router-dom";
import MemberManager from "../components/project/MemberManager";
import CreateTask from "../components/task/CreateTask";
import TaskFilter from "../components/task/TaskFilter";
import "./ProjectDetails.css";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="project-details">
      <div className="project-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
        <h1 className="project-title">Project Management</h1>
        <div />
      </div>

      <div className="section">
        <h3>Team Members</h3>
        <MemberManager projectId={id} />
      </div>

      <div className="section">
        <h3>Create New Task</h3>
        <CreateTask projectId={id} />
      </div>

      <div className="section">
        <h3>Task Board</h3>
        <TaskFilter projectId={id} />
      </div>
    </div>
  );
}
