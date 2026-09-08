# Implementation Plan

## 1. Backend Extensions

1. `categories` GET endpoints for users.
2. `locations` GET endpoints for users.
3. `notifications` endpoints (GET list, PUT mark as read).
4. Expose these via `backend/src/app.js`.

## 2. Frontend Infrastructure

1. Configure React Router (`react-router-dom`) with standard layouts.
2. Setup Axios client & unified API service (`src/api`).
3. Setup Zustand store for auth & global state (`src/store`).

## 3. Frontend Authentication

1. `Login.jsx` basic interface & integration.
2. `Register.jsx` basic interface & integration.
3. Protected route wrappers (`ProtectedRoute.jsx`, `AdminRoute.jsx`).

## 4. Student User Flows

1. `Dashboard.jsx`: Stats, recent matches, active reports.
2. `ReportForm.jsx`: A unified or split form for reporting items (Lost/Found).
3. `MyReports.jsx`: View own reports with filter options.
4. `Matches.jsx`: View potential matches proposed by AI.

## 5. Admin Flow

1. `AdminDashboard.jsx`: Overall system stats.
2. `ManageUsers.jsx`: List of registered users.
3. `ReviewMatches.jsx`: Admin interface to confirm/reject AI matches.

## 6. AI Integration

1. Ensure the Python `ai-service` correctly exposes similarity metrics.
2. Confirm the Node proxy in `matching.service.js` works reliably.
