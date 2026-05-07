# Team Task Manager

## Overview

A full-stack team task management web application built for collaborative project and task management. This application allows users to create projects, assign tasks, track progress, and manage team members with role-based access control. It's designed as a simplified version of tools like Trello or Asana.

This project demonstrates full-stack development skills including frontend, backend, database design, authentication, and deployment.

## Features

### User Authentication

- User registration with name, email, and password
- Secure login using JWT authentication
- Password hashing with bcrypt

### Project Management

- Create new projects (creator automatically becomes Admin)
- Admin can add/remove team members by email
- Members can view projects they are assigned to

### Task Management

- Create tasks with title, description, due date, and priority
- Assign tasks to specific users
- Update task status: To Do, In Progress, Done
- Track task progress within projects

### Dashboard

- Overview of total tasks
- Tasks grouped by status
- Tasks assigned per user
- Identification of overdue tasks

### Role-Based Access Control

- **Admin**: Full access to manage tasks, users, and project members
- **Member**: Can view and update only their assigned tasks

## Tech Stack

### Frontend

- React 19
- Vite (build tool)
- React Router DOM (routing)
- Axios (HTTP client)
- CSS (styling)

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (database)
- JWT (authentication)
- bcrypt (password hashing)
- CORS (cross-origin resource sharing)

### Deployment

- Render (Backend deployment)
- Vercel (Frontend Deployment)

## Prerequisites

- Node.js (v16 or higher)
- npm
- PostgreSQL database
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

2. Install dependencies for both frontend and backend:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Environment Setup

### Backend

Copy the example environment file and configure it:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret_key
PORT=5000
FRONTEND_URL=https://team-task-manager-black-one.vercel.app/
```

### Frontend

Copy the example environment file and configure it:

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env` with your values:

```env
VITE_API_URL=https://team-task-manager-h8th.onrender.com
```

## Running Locally

### Backend

```bash
cd backend
npx prisma migrate dev
npm run dev
```

The backend will run on http://localhost:5000

### Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on http://localhost:5173

## Deployment

This application is deployed using Render for the backend and Vercel for the frontend. Follow these steps to deploy:

### Backend Deployment (Render)

1. Create a new Render service for your backend
2. Connect your GitHub repository
3. Set the build command: `npm install`
4. Set the start command: `npm run dev`
5. Set environment variables in Render:
   - `DATABASE_URL`: Your PostgreSQL database URL
   - `JWT_SECRET`: A secure JWT secret
   - `PORT`: 5000 (or Render's assigned port)
   - `FRONTEND_URL`: Your frontend Vercel URL
6. Deploy the backend service

### Frontend Deployment (Vercel)

1. Create a new Vercel project for the frontend
2. Connect the same repository
3. Set the root directory to `frontend`
4. Set build command: `npm run build`
5. Set environment variables:
   - `VITE_API_URL`: Your backend Render URL
6. Deploy the frontend service

### Database

- Use Render's PostgreSQL service or connect to an external PostgreSQL instance
- Run migrations: `npx prisma migrate deploy`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Project Endpoints

- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id/members` - Add/remove members (Admin only)

### Task Endpoints

- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Usage

1. Register a new account or login
2. Create a new project
3. Add team members to the project (as Admin)
4. Create tasks and assign them to team members
5. Update task status as work progresses
6. View dashboard for project overview

## Demo

[Demo Video](https://example.com/demo-video) - 2-5 minute explanation of the project

## Live Application

[Live App URL](https://your-app.railway.app)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.

## Render Backend Deployment

1. Create a PostgreSQL database on Render.
2. Copy the Render database external connection string.
3. Create a Render Web Service for the `backend` folder.
4. Set build command:

```bash
npm install
```

5. Set start command:

```bash
npm start
```

6. Add backend environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL=https://your-frontend.vercel.app`

7. After deploy, run the migration command from the backend service shell:

```bash
npx prisma migrate deploy
```

Health check:

```text
GET https://your-backend.onrender.com/
```

Expected response:

```text
API is running
```

## Vercel Frontend Deployment

1. Import the `frontend` folder into Vercel.
2. Set build command:

```bash
npm run build
```

3. Set output directory:

```text
dist
```

4. Add frontend environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com
```

5. Redeploy after adding the environment variable.

## Submission Checklist

- Live Vercel frontend URL
- Live Render backend URL
- GitHub repository URL
- README with setup and deployment steps
- 2-5 minute demo video covering auth, projects, members, tasks, dashboard, and role-based access
