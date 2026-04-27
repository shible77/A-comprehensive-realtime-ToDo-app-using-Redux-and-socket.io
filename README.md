# Real-Time To-Do App with Socket.IO

A full-stack task management application with authentication, password recovery, and real-time todo updates. The project uses a React + Vite frontend and an Express + Socket.IO backend with MySQL managed through Drizzle ORM.

## Overview

This project lets users:

- Register and log in with an email and password
- Create, complete, and delete personal todos
- Receive live todo updates through Socket.IO
- Recover a forgotten password using an email OTP flow

The application is split into two folders:

- `client/`: React frontend
- `server/`: Express API, Socket.IO server, auth logic, and database access

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Motion
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express 5
- TypeScript
- Socket.IO
- Drizzle ORM
- MySQL
- Argon2
- JSON Web Tokens
- Nodemailer
- Zod

## Project Structure

```text
To-Do list with Socket.io/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/              # Redux store
│   │   ├── components/       # UI components
│   │   ├── features/         # Redux slices
│   │   ├── pages/            # Route pages
│   │   ├── services/         # Axios and Socket.IO clients
│   │   └── utils/
│   └── package.json
├── server/
│   ├── src/
│   │   ├── controllers/      # Auth, todo, and password recovery handlers
│   │   ├── db/               # Drizzle schema, setup, and migrations
│   │   ├── middlewares/      # Session verification and error middleware
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Mail service
│   │   ├── sockets/          # Socket.IO connection handler
│   │   └── utils/            # JWT helpers
│   └── package.json
└── README.md
```

## How It Works

### Authentication

- Users register with `email`, `username`, and `password`
- Passwords are hashed with `argon2`
- On login, the server creates a JWT and stores it in an HTTP-only cookie named `token`
- Protected routes use `verifySession` middleware to validate the cookie and attach `userId` to the request

### Todos

- Each todo belongs to a specific user
- CRUD actions are handled through `/api/todos/...`
- After a todo is created, updated, or deleted, the backend emits a Socket.IO event
- Connected clients listen for those events and update Redux state in real time

### Password Recovery

- A user submits their email on the forgot-password page
- The backend generates a 6-digit OTP and stores it in the database
- The OTP is sent via Gmail SMTP using Nodemailer
- The user submits the OTP and a new password
- If the OTP is valid and not older than 5 minutes, the password is replaced with a new Argon2 hash

## Database Schema

The backend defines three main tables:

- `users`: stores username, email, and hashed password
- `todos`: stores todo title, completion status, and owning user
- `otp`: stores recovery OTP codes and creation timestamps

Database schema is defined in [server/src/db/schema.ts](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/server/src/db/schema.ts).

## API Summary

### Auth Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/user`
- `POST /api/auth/sendOTP`
- `POST /api/auth/changePass`

### Todo Routes

- `POST /api/todos/create`
- `GET /api/todos/get`
- `PUT /api/todos/update/:id`
- `DELETE /api/todos/delete/:id`

## Real-Time Events

The backend emits these Socket.IO events:

- `todo:created`
- `todo:updated`
- `todo:deleted`

The client subscribes to them in [client/src/services/SocketProvider.tsx](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/client/src/services/SocketProvider.tsx).

## Environment Variables

### Server

Create `server/.env` with the following keys:

```env
DB_URL=
PORT=5000
JWT_SECRET=
CLIENT_URL_DEV=http://localhost:5173
CLIENT_URL_PROD=
EMAIL=
PASSWORD=
NODE_ENV=development
```

Notes:

- `DB_URL` should point to your MySQL database
- `EMAIL` and `PASSWORD` are used by Nodemailer for the OTP email flow
- `CLIENT_URL_DEV` should match your local Vite URL
- `NODE_ENV=development` allows cookies to work locally over `http`

### Client

The client already includes a local development env file pattern. Use `client/.env.development`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd "To-Do list with Socket.io"
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

## Running the Project Locally

You need two terminals.

### Terminal 1: start the backend

```bash
cd server
npm run dev
```

The API server should start on `http://localhost:5000` if your `PORT` is `5000`.

### Terminal 2: start the frontend

```bash
cd client
npm run dev
```

Vite usually starts at `http://localhost:5173`.

## Build for Production

### Client

```bash
cd client
npm run build
```

### Server

```bash
cd server
npm run build
```

Run the compiled backend with:

```bash
cd server
npm start
```

## Testing the Main Flows Manually

Since there is no automated test suite in the repository yet, the main way to test the project is manual verification.

### Authentication flow

1. Register a new account
2. Log in with the new account
3. Refresh the page and confirm the session still exists
4. Log out and confirm protected access is removed

### Todo flow

1. Create a todo
2. Mark it as completed
3. Delete it
4. Open the app in another browser tab and confirm changes appear in real time

### Password recovery flow

1. Go to the forgot-password page
2. Submit the email for an existing account
3. Check the inbox for the OTP
4. Enter the OTP and set a new password
5. Log in with the new password

## Useful Scripts

### Client

- `npm run dev`: start Vite dev server
- `npm run build`: build the frontend
- `npm run lint`: run ESLint
- `npm run preview`: preview the production build locally

### Server

- `npm run dev`: run the backend with Nodemon
- `npm run build`: compile TypeScript to `dist/`
- `npm start`: run the compiled backend
- `npm run db:generate`: generate Drizzle migration files
- `npm run db:push`: push schema changes to the database

## Important Notes

- The backend uses cookie-based auth, so frontend and backend CORS origins must be configured correctly
- The database connection uses an SSL CA file at `server/src/db/ca.pem`
- The repo currently contains tracked environment files; for a public GitHub repository, it is safer to avoid committing real secrets
- There is no automated testing setup yet, so cloning users should rely on the manual verification steps above

## Suggested Improvements

If you continue developing this project, strong next improvements would be:

- Add automated API and UI tests
- Add `.env.example` files and stop tracking real `.env` secrets
- Move all client URLs fully to environment variables
- Add route-level authorization for emitted socket events if you want stricter real-time isolation
- Add Docker support for one-command local setup

## Key Files to Read First

- [client/src/App.tsx](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/client/src/App.tsx)
- [client/src/pages/Home.tsx](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/client/src/pages/Home.tsx)
- [client/src/services/api.ts](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/client/src/services/api.ts)
- [client/src/services/socket.ts](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/client/src/services/socket.ts)
- [server/src/index.ts](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/server/src/index.ts)
- [server/src/controllers/authController.ts](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/server/src/controllers/authController.ts)
- [server/src/controllers/todoControllers.ts](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/server/src/controllers/todoControllers.ts)
- [server/src/controllers/PasswordRecoveryController.ts](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/server/src/controllers/PasswordRecoveryController.ts)
- [server/src/db/schema.ts](/c:/Users/user/Projects/To-Do%20list%20with%20Socket.io/server/src/db/schema.ts)

## Author and license

**Md. Salauddin** — Full-stack engineer (backend-focused).

This project is licensed under the **MIT License**.
