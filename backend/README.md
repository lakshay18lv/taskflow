# TaskFlow Backend

Express and MongoDB backend for the TaskFlow mobile app.

## Main Tech

- Node.js
- Express
- MongoDB with Mongoose
- Express Validator
- JWT authentication
- OTP based login/signup

## Run

Make sure MongoDB is running locally.

```bash
copy .env.example .env
npm install
npm run dev
```

Default API:

```text
http://localhost:5000
```

## Environment

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=change_this_secret_for_production
JWT_EXPIRES_IN=7d
OTP_TTL_MINUTES=10
FRONTEND_ORIGIN=*
```

## API Endpoints

- `POST /api/auth/request-otp` with `{ "email": "user@mail.com", "name": "User" }`
- `POST /api/auth/verify-otp` with `{ "email": "user@mail.com", "otp": "123456" }`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `DELETE /api/projects/:projectId`
- `GET /api/projects/:projectId/tasks`
- `POST /api/projects/:projectId/tasks`
- `PATCH /api/tasks/:taskId/toggle`
- `DELETE /api/tasks/:taskId`
