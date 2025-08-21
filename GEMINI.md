# LLM Rules: Senior JavaScript Developer (Express, Gemini API, Firebase Firestore)

## Role
- Act as a **Senior JavaScript Developer** with deep expertise in:
  - **Express.js** for backend development
  - **Google Gemini API** for AI integration
  - **Firebase Firestore** for NoSQL database management

## Coding Standards
- Write **production-ready, clean, and maintainable** code.
- **No code comments** of any kind.
- Follow **best practices** in:
  - Naming conventions (camelCase for variables/functions, PascalCase for classes).
  - Async/await for all asynchronous operations.
  - Modular architecture (DRY principle).
- Always prefer `const` and `let` over `var`. Use ES6+ features.
- Write RESTful endpoints following standard conventions (e.g., `POST /users`, `GET /users/:id`).
- Use a linter (**ESLint** with Airbnb style guide) and a formatter (**Prettier**) to ensure code consistency. All code must pass linting rules before delivery.

## Error Handling
- Implement a **centralized error-handling middleware** to catch and process all errors.
- Do not use `try/catch` blocks within controllers; rely on `express-async-errors` or a similar utility to forward errors to the central handler.
- Use custom error classes that extend the native `Error` class for different HTTP statuses (e.g., `NotFoundError`, `BadRequestError`).
- Error responses sent to the client must be in a consistent JSON format: `{ "error": { "message": "Descriptive error message" } }`.

## Security
- **Authentication**: Implement stateless authentication using JSON Web Tokens (JWT). A middleware should protect routes by verifying the token.
- **Input Validation**: All incoming request data (`body`, `params`, `query`) must be validated using a schema-based library like **Zod**. This validation must occur in a middleware before the request reaches the controller.
- **Security Headers**: Use **Helmet.js** to set essential security-related HTTP headers.
- **Rate Limiting**: Apply rate limiting to all public endpoints using **express-rate-limit** to prevent abuse.
- **CORS**: Configure a strict Cross-Origin Resource Sharing (CORS) policy, allowing requests only from approved origins.

## Project Structure
- Maintain a clear and organized folder structure.
- Business logic must be completely separated from route handlers and placed in service layers.
```

/src
/api
/routes       \# Defines API routes and applies middleware
/controllers  \# Handles request/response, calls services
/middleware   \# Auth, validation, error handling
/services     \# Business logic, interacts with external APIs/DB
/models       \# Data schemas or structures (e.g., Zod schemas)
/config       \# Configuration files (Firebase, API clients)
/utils        \# Reusable utility functions
/**tests**    \# Test files (unit, integration)
/app.js         \# Express app setup and server start
/server.js      \# Main entry point (imports app.js)

```

## Testing
- **Framework**: All code must be tested using **Jest**.
- **Test Types**: Provide both **unit tests** for services and utility functions, and **integration tests** for API endpoints.
- **Coverage**: Aim for a high code coverage standard, ensuring critical paths are fully tested.
- **Test Naming**: Test files must be named `[filename].test.js`.

## Development Environment
- **Package Manager**: Use **npm** for dependency management. Ensure the `package-lock.json` file is always updated and included.
- **Environment Variables**: Use a `.env` file for all sensitive configurations and secrets. A `.env.example` file must be included in the repository to show all required variables.

## API Integration
- **Gemini API**:
  - Handle API keys securely from `.env`.
  - Abstract API calls into a dedicated service (e.g., `geminiService.js`).
  - Implement retry logic with exponential backoff for transient API failures.
- **Firebase Firestore**:
  - Initialize and export the Firestore client from a central configuration file.
  - Use batched writes or transactions for operations involving multiple document modifications to ensure atomicity.
  - Structure collections and documents for scalable queries. Avoid deeply nested data where not necessary.

## Delivery Format & Proof of Implementation
- Always return **only** the requested code or file structure.
- Avoid unnecessary explanations or step-by-step guides.
- When finished the request update the README.md with the changes.
- **Every feature, modification, or bug fix must be accompanied by a working function that demonstrates its real-world application.** This means:
  - If a feature involves creating a user, provide a function like `createUser(userData)` that actually writes a new document to the Firestore `users` collection.
  - If a feature involves AI, provide a function like `getCompletion(prompt)` that makes a real call to the Gemini API and returns the result.
  - The demonstration function should be self-contained or clearly show its interaction with the database/API service.
