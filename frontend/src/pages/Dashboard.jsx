import { useEffect, useState } from "react";
import API from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
      alert("Error fetching tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Stats
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === "To Do").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const done = tasks.filter(t => t.status === "Done").length;

  return (
    <div className="dashboard">
      <h1>Team Task Manager</h1>

      {/* Stats */}
      <div className="stats">
        <div className="card">Total: {total}</div>
        <div className="card">To Do: {todo}</div>
        <div className="card">In Progress: {inProgress}</div>
        <div className="card">Done: {done}</div>
      </div>

      <button className="refresh-btn" onClick={fetchTasks}>
        Refresh Tasks
      </button>

      {/* Task Columns */}
      <div className="task-board">
        <div className="column">
          <h3>To Do</h3>
          {tasks.filter(t => t.status === "To Do").map(t => (
            <div key={t.id} className="task-card">
              <p>{t.title}</p>
            </div>
          ))}
        </div>

        <div className="column">
          <h3>In Progress</h3>
          {tasks.filter(t => t.status === "In Progress").map(t => (
            <div key={t.id} className="task-card">
              <p>{t.title}</p>
            </div>
          ))}
        </div>

        <div className="column">
          <h3>Done</h3>
          {tasks.filter(t => t.status === "Done").map(t => (
            <div key={t.id} className="task-card">
              <p>{t.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}