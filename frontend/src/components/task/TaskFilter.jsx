import { useCallback, useEffect, useState } from "react";
import { getTasks } from "../../api/taskApi";
import TaskCard from "./TaskCard";

export default function TaskFilter({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [userFilter, setUserFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      const projectTasks = res.data.filter((task) => task.projectId === parseInt(projectId));
      setTasks(projectTasks);
      setFilteredTasks(projectTasks);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    let filtered = tasks;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (userFilter !== "ALL") {
      filtered = filtered.filter((task) => task.assignedTo === parseInt(userFilter));
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, userFilter]);

  const uniqueUsers = [...new Set(tasks.map((task) => task.assignedTo))];

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div>
      <div className="filters">
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="ALL">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <select onChange={(e) => setUserFilter(e.target.value)} value={userFilter}>
          <option value="ALL">All Users</option>
          {uniqueUsers.map((userId) => (
            <option key={userId} value={userId}>
              {tasks.find((task) => task.assignedTo === userId)?.user?.name || `User ${userId}`}
            </option>
          ))}
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks found. Create your first task above.</p>
      ) : (
        <div className="task-board">
          <div className="task-column">
            <h4>To Do ({filteredTasks.filter((task) => task.status === "TODO").length})</h4>
            {filteredTasks
              .filter((task) => task.status === "TODO")
              .map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
              ))}
          </div>

          <div className="task-column">
            <h4>
              In Progress ({filteredTasks.filter((task) => task.status === "IN_PROGRESS").length})
            </h4>
            {filteredTasks
              .filter((task) => task.status === "IN_PROGRESS")
              .map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
              ))}
          </div>

          <div className="task-column">
            <h4>Done ({filteredTasks.filter((task) => task.status === "DONE").length})</h4>
            {filteredTasks
              .filter((task) => task.status === "DONE")
              .map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
