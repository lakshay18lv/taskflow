# TaskFlow - Project & Task Manager App

TaskFlow is a mobile project and task manager built with React Native, Expo, Redux Toolkit, Axios, Node.js, Express, and MongoDB. It supports OTP based login, protected API requests, project CRUD, task CRUD, session persistence, and light/dark mode.

## Tech Stack

- Frontend: React Native with Expo
- State Management: Redux Toolkit with async thunks
- API Requests: Axios
- Backend: Node.js with Express
- Database: MongoDB with Mongoose
- Authentication: OTP based auth with JWT session token
- Storage: AsyncStorage for persisted frontend session

## Project Structure

```text
taskflow/
  backend/
    src/
      config/          Database and environment config
      middleware/      Auth, validation, and error middleware
      modules/
        auth/          OTP auth controller, routes, User model
        projects/      Project controller, routes, Project model
        tasks/         Task controller, routes, Task model
      utils/           Token, OTP, async helper utilities
    .env.example
    package.json

  frontend/
    src/
      api/             Axios API client
      components/      Reusable UI components
      constants/       Theme colors
      navigation/      React Navigation setup
      screens/         Auth, Projects, Project Detail screens
      store/           Redux store and slices
    App.js
    app.json
    package.json
```

## Features

- Request OTP and verify OTP for login/signup
- JWT based protected backend routes
- Persist user session on the mobile app
- Create, view, and delete projects
- Create, complete/incomplete, and delete tasks inside a project
- Redux slices for auth, projects, tasks, and theme
- Loading indicators and validation messages
- Light and dark mode support
- Clean mobile UI with project progress and task status

## Backend Setup

Make sure MongoDB is running locally. The default connection is:

```text
mongodb://127.0.0.1:27017/taskflow
```

Run backend:

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

## Frontend Setup

Run Expo app:

```bash
cd frontend
npm install
npx expo start --clear
```

For laptop/browser preview, press:

```text
w
```

For Android emulator, press:

```text
a
```

For Expo Go on phone, scan the QR code from the terminal.

## API URL Notes

The frontend API URL is in:

```text
frontend/src/api/client.js
```

Use this for Android emulator:

```js
const API_URL = 'http://10.0.2.2:5000/api';
```

Use this for browser/laptop preview:

```js
const API_URL = 'http://localhost:5000/api';
```

Use your laptop IP address for a physical phone:

```js
const API_URL = 'http://YOUR_LAPTOP_IP:5000/api';
```

## API Endpoints

- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `DELETE /api/projects/:projectId`
- `GET /api/projects/:projectId/tasks`
- `POST /api/projects/:projectId/tasks`
- `PATCH /api/tasks/:taskId/toggle`
- `DELETE /api/tasks/:taskId`

## Test Flow

1. Start MongoDB.
2. Start backend with `npm run dev`.
3. Start frontend with `npx expo start --clear`.
4. Enter name and email.
5. Click Send OTP.
6. Use the Development OTP shown on screen.
7. Create a project.
8. Open the project and add tasks.
9. Mark tasks complete/incomplete or delete them.

## APK / Live Link

For assignment submission, build an APK with Expo/EAS or share a live Expo preview link.

```bash
npm install -g eas-cli
eas build -p android --profile preview
```

If EAS is not configured yet, run:

```bash
eas build:configure
```
