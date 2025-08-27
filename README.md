# Societas Server

This is the backend server for Societas, a collaborative platform that leverages AI to enhance team communication and productivity. The server is built with Node.js and Express, and it uses Firebase Firestore as its database and the Google Gemini API for its AI capabilities.

## Features

*   **User Management:** Create, retrieve, update, and delete users.
*   **AI Agents:** Create, retrieve, update, and delete AI agents that can participate in chats.
*   **Real-time Chat:** Create chat rooms, send and receive messages in real-time.
*   **Task Management:** Create and manage tasks within project boards.
*   **AI-powered features:** The Gemini API is integrated to provide AI capabilities, although the specific features are not fully detailed in the code.

## Recent Changes

*   **User ID from Header (2025-08-26):**
    *   All routes now expect the `userID` to be passed in the `x-user-id` header of the request, instead of a URL parameter.
    *   Added a middleware to validate the presence of the `x-user-id` header in all protected routes.
*   **Message Creation Optimization (2025-08-23):**
    *   Refactored the `createMessage` controller to use a single atomic batch write to Firestore. This ensures that creating a user's message, generating and storing the AI's response, and updating the chat's `last_message` all succeed or fail together, improving data consistency.
    *   Updated the Gemini API call to use the correct model (`gemini-2.5-flash`) and align with the latest `@google/genai` SDK practices for better performance and reliability.
    *   Enhanced error handling to use the centralized middleware, following project guidelines.
    *   Improved input validation for creating messages.

## Technologies Used

*   **Node.js:** A JavaScript runtime for building server-side applications.
*   **Express:** A web application framework for Node.js.
*   **Firebase Firestore:** A NoSQL cloud database for storing and syncing data.
*   **Google Gemini API:** An API for accessing Google's AI models.
*   **Jest:** A JavaScript testing framework.
*   **Faker.js:** A library for generating fake data for testing purposes.
*   **Nodemon:** A tool that automatically restarts the server during development.
*   **Dotenv:** A module for loading environment variables from a `.env` file.

## API Endpoints

All endpoints that require a `userId` now expect it to be passed in the `x-user-id` header.

### Home

*   `GET /home`: Returns a welcome message.

### Users

*   `POST /api/users`: Creates a new user.
*   `GET /api/users`: Retrieves all users.
*   `GET /api/users/:id`: Retrieves a specific user.
*   `PUT /api/users/:id`: Updates a specific user.
*   `DELETE /api/users`: Deletes a specific user.
*   `GET /api/users/settings`: Retrieves the settings for a specific user.
*   `PUT /api/users/settings`: Updates the settings for a specific user.

### Agents

*   `POST /api/users/agents`: Creates a new AI agent for a user.
*   `GET /api/users/agents`: Retrieves all AI agents for a user.
*   `GET /api/users/agents/:agentId`: Retrieves a specific AI agent for a user.
*   `PUT /api/users/agents/:agentId`: Updates a specific AI agent for a user.
*   `DELETE /api/users/agents/:agentId`: Deletes a specific AI agent for a user.

### Boards

*   `POST /api/users/boards`: Creates a new project board for a user.
*   `GET /api/users/boards`: Retrieves all project boards for a user.
*   `GET /api/users/boards/:boardId`: Retrieves a specific project board for a user.
*   `PUT /api/users/boards/:boardId`: Updates a specific project board for a user.
*   `DELETE /api/users/boards/:boardId`: Deletes a specific project board for a user.

### Tasks

*   `POST /api/users/boards/:boardId/tasks`: Creates a new task within a project board.
*   `GET /api/users/boards/:boardId/tasks`: Retrieves all tasks from a specific project board.
*   `GET /api/users/boards/:boardId/tasks/:taskId`: Retrieves a specific task from a project board.
*   `PUT /api/users/boards/:boardId/tasks/:taskId`: Updates a specific task from a project board.
*   `DELETE /api/users/boards/:boardId/tasks/:taskId`: Deletes a specific task from a project board.

### Chats

*   `POST /api/users/chats`: Creates a new chat room for a user.
*   `GET /api/users/chats`: Retrieves all chat rooms for a user.
*   `GET /api/users/chats/:chatId`: Retrieves a specific chat room for a user.
*   `GET /api/users/chats/with/:agentId`: Retrieves a chat with a specific agent.
*   `DELETE /api/users/chats/:chatId`: Deletes a specific chat room for a user.

### Messages

*   `POST /api/users/chats/:chatId/messages`: Sends a new message to a chat room.
*   `GET /api/users/chats/:chatId/messages`: Retrieves all messages from a specific chat room.

## Getting Started

### Prerequisites

*   Node.js and npm installed.
*   A Firebase project with Firestore enabled.
*   A Google Gemini API key.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/societas-server.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory and add the following environment variables:
    ```
    PORT=3000
    GOOGLE_API_KEY=your-google-api-key
    FIREBASE_PROJECT_ID=your-firebase-project-id
    FIREBASE_CLIENT_EMAIL=your-firebase-client-email
    FIREBASE_PRIVATE_KEY=your-firebase-private-key
    ```

### Running the Project

*   To start the server, run:
    ```bash
    npm start
    ```
*   To run the tests, run:
    ```bash
    npm test
    ```
*   To seed the database with fake data, run:
    ```bash
    npm run seed
    ```

## Project Structure

```
/
├───.gitignore
├───DatabaseDiagram.png
├───GEMINI.md
├───package.json
├───server.js
├───.git/...
├───node_modules/...
└───src/
    ├───app.js
    ├───jest.setup.js
    ├───api/
    │   ├───controllers/
    │   │   ├───agents.js
    │   │   ├───boards.js
    │   │   ├───chats.js
    │   │   ├───home.js
    │   │   ├───messages.js
    │   │   ├───tasks.js
    │   │   └───users.js
    │   └───routes/
    │       ├───Agents/
    │       │   └───agents.js
    │       ├───Boards/
    │       │   ├───boards.js
    │       │   └───tasks.js
    │       ├───Chats/
    │       │   └───chats.js
    │       ├───Home/
    │       │   └───home.js
    │       ├───Messages/
    │       │   └───messages.js
    │       └───Users/
    │           └───users.js
    ├───config/
    │   ├───firebaseConfig.js
    │   └───jest.config.js
    └───tests/
        ├───api.test.js
        ├───seed.js
        └───mock-data/
            ├───agents.js
            ├───boards.js
            ├───chats.js
            ├───messages.js
            ├───tasks.js
            └───users.js
```

## Database Schema

*   **`users`** (collection)
    *   `name` (string)
    *   `avatar` (string)
    *   `enterprise` (string)
    *   `agents` (subcollection)
    *   `boards` (subcollection)
    *   `settings` (map)
    *   `chats` (subcollection)
*   **`agents`** (subcollection of `users`)
    *   `name` (string)
    *   `settings` (map)
    *   `board` (string)
    *   `tasks` (array)
    *   `sub-agents` (array)
    *   `documents` (array)
    *   `memory` (string)
    *   `status` (string)
    *   `created_at` (timestamp)
    *   `capabilities` (array)
    *   `department` (string)
*   **`boards`** (subcollection of `users`)
    *   `description` (string)
    *   `tasks` (subcollection)
    *   `summary` (string)
    *   `finish_pc` (number)
    *   `created_at` (timestamp)
*   **`tasks`** (subcollection of `boards`)
    *   `creator` (string)
    *   `assignee` (string)
    *   `description` (string)
    *   `status` (string)
    *   `weight` (number)
    *   `related` (array)
    *   `result` (string)
*   **`chats`** (subcollection of `users`)
    *   `participants` (array)
    *   `messages` (subcollection)
    *   `summary` (string)
    *   `created_at` (timestamp)
    *   `last_message` (string)
*   **`messages`** (subcollection of `chats`)
    *   `sender` (string)
    *   `content` (string)
    *   `time` (timestamp)
    *   `status` (string)