# Team Task Manager

Full-stack team task management app built with React, Express, Prisma, PostgreSQL, and JWT authentication.

## Features

- Signup and login with hashed passwords and JWT authentication
- Project creation with the creator added as project admin
- Admin project member management by email
- Task creation with title, description, due date, priority, assignee, and status
- Role-based access: admins manage project tasks and members; members see and update only their assigned tasks
- Dashboard metrics for total tasks, status counts, overdue tasks, and tasks per user

## Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Set `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_URL` in `backend/.env`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to your backend API URL, for example `http://localhost:5000/api`.

## Railway Deployment

1. Create a Railway PostgreSQL database and copy its `DATABASE_URL`.
2. Deploy the backend service from the `backend` folder.
3. Add backend environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CLIENT_URL` with your deployed frontend URL
4. Run Prisma migrations on Railway with `npx prisma migrate deploy`.
5. Deploy the frontend service from the `frontend` folder.
6. Add frontend environment variable `VITE_API_URL` with your deployed backend API URL ending in `/api`.

## Submission Checklist

- Live Railway frontend URL
- Live Railway backend URL connected through `VITE_API_URL`
- GitHub repository URL
- README with setup and deployment steps
- 2-5 minute demo video covering auth, projects, members, tasks, dashboard, and role-based access
