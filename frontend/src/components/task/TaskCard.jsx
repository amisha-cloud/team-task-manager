import { updateTask } from "../../api/taskApi";

export default function TaskCard({ task, onUpdate }) {
  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(task.id, newStatus);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.log(err);
      alert("Error updating task");
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "DONE";
  const isHighPriority = task.priority === "HIGH";

  return (
    <div className={`task-card ${isOverdue ? "overdue" : ""} ${isHighPriority ? "high-priority" : ""}`}>
      <h5>{task.title}</h5>
      {task.description && <p>{task.description}</p>}

      <div className="task-meta">
        <span>{task.user?.name || `User ${task.assignedTo}`}</span>
        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span className="task-priority">{task.priority} Priority</span>
        {isOverdue && <span style={{ color: "var(--danger)", fontWeight: "bold" }}>Overdue</span>}
      </div>

      <div className="task-status-buttons">
        {task.status !== "TODO" && (
          <button onClick={() => handleStatusChange("TODO")} style={{ background: "#64748b", color: "white" }}>
            To Do
          </button>
        )}
        {task.status !== "IN_PROGRESS" && (
          <button onClick={() => handleStatusChange("IN_PROGRESS")} style={{ background: "var(--warning)", color: "#1f2937" }}>
            In Progress
          </button>
        )}
        {task.status !== "DONE" && (
          <button onClick={() => handleStatusChange("DONE")} style={{ background: "var(--success)", color: "white" }}>
            Done
          </button>
        )}
      </div>
    </div>
  );
}
