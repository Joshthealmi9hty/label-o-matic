# Image Labeling Application

This is a full-stack web application for labeling images. It uses SQLite for the database, Express for the backend API, and React with Tailwind CSS for the frontend.

## Running the Application

1. Start the backend server (runs on port 5000):
```bash
npm run start:server
```

2. Start the frontend development server (runs on port 3000):
```bash
npm run dev
```

3. Open your browser and navigate to http://localhost:3000

## Features

- View and label images one at a time
- Progress tracking
- Clean, responsive interface
- Toast notifications for feedback
- Support for future text content
- Manually reset image database using npm run reset-db (do this before starting servers)

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Express, SQLite
- Database: SQLite with better-sqlite3