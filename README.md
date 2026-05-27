# She Can Foundation - Contact Form Application

A modern, responsive full-stack web application built for the She Can Foundation. It features a beautiful, animated contact form for users to submit messages, and a secured admin dashboard to view and manage these submissions.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS (v4), Framer Motion, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT Authentication
- **Database**: MongoDB

## Features
- **Modern UI**: Clean and professional design with smooth animations.
- **Form Validation**: Client-side and server-side validation.
- **Admin Dashboard**: Secured area to view, search, filter, and delete messages.
- **Responsive**: Fully responsive design that works on mobile, tablet, and desktop.

## Project Structure
```
.
├── backend/          # Node.js + Express API
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Custom middleware (auth)
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js     # Entry point
└── frontend/         # React application
    ├── src/
    │   ├── components/ # React components (ContactForm, AdminLogin, AdminDashboard)
    │   ├── services/   # API configuration (Axios)
    │   ├── App.jsx     # Main layout and routing
    │   └── index.css   # Tailwind configuration and custom styles
    └── vite.config.js
```

## Setup Instructions

### 1. Database Setup
Make sure you have MongoDB installed locally or have a MongoDB URI (e.g., MongoDB Atlas).

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Update the `MONGODB_URI` and `JWT_SECRET` in the `.env` file if necessary.*
4. Seed the database with a default Admin user:
   ```bash
   node seedAdmin.js
   ```
   *(This will create an admin with username: `admin`, password: `password123`)*
5. Start the backend server:
   ```bash
   node server.js
   ```
   *(The server will run on `http://localhost:5000`)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the provided local URL (typically `http://localhost:5173`).

## Usage
- **Public Form**: Access the main URL to see the contact form and submit a message.
- **Admin Dashboard**: Navigate to `/admin/login`. Login with the default credentials (`admin` / `password123`) to view submissions.
