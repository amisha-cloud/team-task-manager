import { updateTask } from "../../api/taskApi";

export default function TaskCard({ task, refresh }) {
  const changeStatus = async (status) => {
    await updateTask(task.id, status);
    refresh();
  };

  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      <small>Priority: {task.priority}</small>

      <div>
        <button onClick={() => changeStatus("TODO")}>To Do</button>
        <button onClick={() => changeStatus("IN_PROGRESS")}>Progress</button>
        <button onClick={() => changeStatus("DONE")}>Done</button>
      </div>
    </div>
  );
}