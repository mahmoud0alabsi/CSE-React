# CodeSpace Editor Frontend

CodeSpace Editor Frontend is a React.js application that provides a collaborative code editing interface for the CodeSpace Editor platform. It integrates with a [Spring Boot Backend](https://github.com/mahmoud0alabsi/code_space_editor) for project, branch, and commit management, and a [Yjs Server](https://github.com/mahmoud0alabsi/code_space_editor_yjs_server) for real-time document collaboration using Monaco Editor.

## Features

- **Workspace (Dashboard)**: Create, view, and manage projects.
- **Branch Management**: Fork branches and manage commits.
- **Real-Time Collaboration**: Edit code collaboratively with Yjs and Monaco Editor.
- **Code Editing**: Syntax highlighting and IntelliSense via Monaco Editor.
- **Authentication**: Secure JWT-based login and registration.
- **Responsive Design**: Optimized for desktop and mobile devices.

## Why Yjs?

Yjs powers real-time collaboration using **Conflict-free Replicated Data Types (CRDT)**:
- **Conflict-Free Edits**: Automatically resolves concurrent edits, ensuring document consistency.
- **Low Latency**: Sends incremental updates via WebSocket for fast synchronization.
- **Monaco Integration**: Enables live cursor tracking and text edits in `/collaborative-editor`.

## Tech Stack

- **Frontend**: React.js
- **State Management**: Redux Toolkit
- **API Client**: Axios
- **Code Editor**: Monaco Editor
- **Collaboration**: Yjs with WebSocket (`y-websocket`)
- **Package Manager**: npm

## Prerequisites

- Node.js 18+
- npm 9+
- [CodeSpace Editor Backend](https://github.com/mahmoud0alabsi/code_space_editor) running
- [CodeSpace Editor Yjs Server](https://github.com/mahmoud0alabsi/code_space_editor_yjs_server) running

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mahmoud0alabsi/code_space_editor_react.git
cd codespace-editor-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
SPRING_SERVER_BASE_URL=http://localhost:8080
API_BASE_URL=http://localhost:8080/api/v1
YJS_SERVER_URL=ws://localhost:1234
```

- `SPRING_SERVER_BASE_URL`: Spring Boot backend host.
- `API_BASE_URL`: Spring Boot backend API URL.
- `YJS_SERVER_URL`: Yjs WebSocket server URL.

### 4. Run the Backend and Yjs Server

- **Backend**: Follow the [backend README](https://github.com/mahmoud0alabsi/code_space_editor) to start the Spring Boot server.
- **Yjs Server**: Follow the [Yjs server README](https://github.com/mahmoud0alabsi/code_space_editor_yjs_server) to start the WebSocket server (`node server.js`).

### 5. Run the Application

```bash
npm run dev
```

- The app runs on `http://localhost:3000`.
- Open in a browser to access.

### 6. Build for Production

```bash
npm run build
```

- Output is in the `dist` folder.
- Serve with `npm run preview` or a static server.

## Navigation

- `/`: Home page.
- `/login`: Login page (also contains OAuth2 (Google and Github)).
- `/register`: User registration.
- `/workspace`: Dashboard for managing projects.
- `/collaborative-editor`: Real-time code editing with Monaco Editor and Yjs.

## API Integration

The frontend interacts with the Spring Boot backend via RESTful APIs:

- `POST /api/v1/auth/login`: Authenticate and receive a JWT token.
- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/projects`: Create a project.
- `POST /api/v1/branches/p/{projectId}/b/{branchId}/fork`: Fork a branch.

The Yjs server (`YJS_SERVER_URL`) handles real-time collaboration via WebSocket.

## Project Structure

```
public/
├── assets/                # Images, icons
src/
├── api/                   # api handlers
├── components/            # Reusable React components
├── hooks/                 # Editor and chat hooks
├── pages/                 # Page components (Home, Login, Workspace, CollaborativeEditor)
├── state_managment/       # Redux Toolkit slices and store
├── services/              # Sessions sync
├── routes/                # App routes
├── App.jsx                # Main app with routing
├── index.jsx              # Entry point
```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Contact

For issues or questions, open a GitHub issue or contact malabsi034@gmail.com.