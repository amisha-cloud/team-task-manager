import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/projectApi";
import { getTasks } from "../api/taskApi";
import "./dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tasksPerUser, setTasksPerUser] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [projectsRes, tasksRes] = await Promise.all([
        getProjects(),
        getTasks(),
      ]);

      const userTasks = tasksRes.data;
      const now = new Date();

      setProjects(projectsRes.data);
      setTasks(userTasks);
      setStats({
        totalTasks: userTasks.length,
        todoTasks: userTasks.filter((task) => task.status === "TODO").length,
        inProgressTasks: userTasks.filter((task) => task.status === "IN_PROGRESS").length,
        doneTasks: userTasks.filter((task) => task.status === "DONE").length,
        overdueTasks: userTasks.filter(
          (task) => task.status !== "DONE" && new Date(task.dueDate) < now
        ).length,
      });

      const perUser = Object.values(
        userTasks.reduce((acc, task) => {
          const key = task.assignedTo;
          if (!acc[key]) {
            acc[key] = {
              userId: key,
              name: task.user?.name || `User ${key}`,
              total: 0,
              done: 0,
              overdue: 0,
            };
          }

          acc[key].total += 1;
          if (task.status === "DONE") acc[key].done += 1;
          if (task.status !== "DONE" && new Date(task.dueDate) < now) {
            acc[key].overdue += 1;
          }

          return acc;
        }, {})
      ).sort((a, b) => b.total - a.total);

      setTasksPerUser(perUser);
    } catch (err) {
      console.log(err);
      alert("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Team Dashboard</h1>
          <p>Manage projects, team workload, and task progress in one place.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-section">
          <div className="card-header">
            <div className="header-title">
              <span className="icon">P</span>
              <div>
                <h2>Project Management</h2>
                <p>Create and manage team projects</p>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/create-project")}>
              New Project
            </button>
          </div>

          <div className="card-content">
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>No projects yet</p>
                <small>Create your first project to get started</small>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <h4>{project.name}</h4>
                    </div>
                    <p className="project-description">
                      Your role: {project.currentUserRole || "MEMBER"}
                    </p>
                    <button
                      className="btn btn-outline btn-sm btn-full"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-card dashboard-section">
          <div className="card-header">
            <div className="header-title">
              <span className="icon">T</span>
              <div>
                <h2>Task Statistics</h2>
                <p>Status and overdue summary</p>
              </div>
            </div>
          </div>

          <div className="card-content">
            <div className="task-stats-grid">
              <div className="stat-card stat-total">
                <div className="stat-number">{stats.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card stat-todo">
                <div className="stat-number">{stats.todoTasks}</div>
                <div className="stat-label">To Do</div>
              </div>
              <div className="stat-card stat-inprogress">
                <div className="stat-number">{stats.inProgressTasks}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card stat-done">
                <div className="stat-number">{stats.doneTasks}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card stat-overdue">
                <div className="stat-number">{stats.overdueTasks}</div>
                <div className="stat-label">Overdue</div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card dashboard-section">
          <div className="card-header">
            <div className="header-title">
              <span className="icon">U</span>
              <div>
                <h2>Tasks Per User</h2>
                <p>Assignment load and completion by teammate</p>
              </div>
            </div>
          </div>

          <div className="card-content">
            {tasksPerUser.length === 0 ? (
              <div className="empty-state">
                <p>No assigned tasks yet</p>
                <small>Create tasks and assign them to members to see this chart</small>
              </div>
            ) : (
              <div className="user-stats-list">
                {tasksPerUser.map((item) => (
                  <div key={item.userId} className="user-stat-row">
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.done} completed, {item.overdue} overdue</p>
                    </div>
                    <strong>{item.total}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-card dashboard-section">
          <div className="card-header">
            <div className="header-title">
              <span className="icon">R</span>
              <div>
                <h2>Role-Based Access</h2>
                <p>Admin and member permissions</p>
              </div>
            </div>
            {projects.length > 0 && (
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/project/${projects[0].id}`)}>
                Manage Members
              </button>
            )}
          </div>

          <div className="card-content">
            <div className="role-info-grid">
              <div className="role-card">
                <div className="role-icon">Admin</div>
                <h4>Admin Role</h4>
                <ul>
                  <li>Create projects</li>
                  <li>Add and remove members</li>
                  <li>Create and assign tasks</li>
                  <li>Update project task status</li>
                </ul>
              </div>
              <div className="role-card">
                <div className="role-icon">Member</div>
                <h4>Member Role</h4>
                <ul>
                  <li>View assigned projects</li>
                  <li>View assigned tasks</li>
                  <li>Update own task status</li>
                  <li>Read project team members</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card dashboard-section">
          <div className="card-header">
            <div className="header-title">
              <span className="icon">A</span>
              <div>
                <h2>Recent Activity</h2>
                <p>Latest tasks across accessible projects</p>
              </div>
            </div>
          </div>

          <div className="card-content">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks yet</p>
                <small>Create your first task in a project to see activity</small>
              </div>
            ) : (
              <div className="tasks-list">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="task-item">
                    <div className="task-left">
                      <div className={`status-badge status-${task.status.toLowerCase()}`}>
                        {task.status.replace("_", " ")}
                      </div>
                    </div>
                    <div className="task-center">
                      <h4>{task.title}</h4>
                      <p className="task-project">{task.project?.name || "Unknown project"}</p>
                    </div>
                    <div className="task-right">
                      <small>Due: {new Date(task.dueDate).toLocaleDateString()}</small>
                      <small>{task.user?.name || "Unknown user"}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
