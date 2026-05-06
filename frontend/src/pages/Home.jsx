import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Team Task Manager</h1>
        <p>
          Streamline your team's productivity with a simple task management solution.
        </p>

        {!token ? (
          <div className="hero-actions">
            <Link to="/register" className="home-btn home-btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="home-btn home-btn-outline">
              Sign In
            </Link>
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/dashboard" className="home-btn home-btn-primary">
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="container">
          <h2>Key Features</h2>

          <div className="features-grid">
            <div className="feature-card">
              <h3>Project Management</h3>
              <p>Create and manage projects with your team. Assign roles and track progress.</p>
            </div>

            <div className="feature-card">
              <h3>Task Tracking</h3>
              <p>Create, assign, and track tasks with priority levels and due dates.</p>
            </div>

            <div className="feature-card">
              <h3>Team Collaboration</h3>
              <p>Add registered team members by email and collaborate on projects.</p>
            </div>

            <div className="feature-card">
              <h3>Dashboard Analytics</h3>
              <p>View task statistics, status counts, overdue tasks, and tasks per user.</p>
            </div>

            <div className="feature-card">
              <h3>Role-Based Access</h3>
              <p>Secure access control with Admin and Member permissions.</p>
            </div>

            <div className="feature-card">
              <h3>Responsive Design</h3>
              <p>Use the application comfortably on desktop, tablet, and mobile screens.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="workflow">
        <div className="container">
          <h2>How It Works</h2>

          <div className="workflow-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Register & Login</h3>
              <p>Create your account and sign in to access the platform.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Create Project</h3>
              <p>Create a new project and become the project admin.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Add Members</h3>
              <p>Add registered users to your project by email.</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Manage Tasks</h3>
              <p>Create tasks, assign them to members, and update status.</p>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <h3>Monitor Progress</h3>
              <p>Use the dashboard to view statistics and project progress.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
