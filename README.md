# Team Task Manager

Full-stack team task management app built with React, Vite, Express, Prisma, PostgreSQL, and JWT authentication.

## Features

- Signup and login with hashed passwords and JWT authentication
- Project creation with the creator added as project admin
- Admin project member management by registered email
- Task creation with title, description, due date, priority, assignee, and status
- Role-based access for admins and members
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

Backend `.env` values:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend `.env` value:

```env
VITE_API_URL=http://localhost:5000
```

Do not add `/api` to `VITE_API_URL`; the frontend API client appends `/api` automatically.

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
