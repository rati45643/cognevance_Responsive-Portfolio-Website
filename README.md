# Responsive Portfolio Website & CMS - Ratish Kannur

A full-stack personal portfolio application built for **Ratish Kannur** (B.E. Information Science & Engineering, CGPA 8.6). Features a React.js glassmorphic frontend, an Express.js REST API backend, SQLite persistent storage, a live password-protected Admin CMS editor, and a portfolio-grounded Personal AI Chatbot Assistant.

![Portfolio Preview](/images/portfolio_website_preview.png)

---

## 🛠️ Technologies Used

- **Frontend:** React 19, Vite 6, Lucide React Icons, Custom CSS Modules / Design Tokens (Outfit & Inter fonts).
- **Backend:** Node.js, Express.js, CORS, Body-Parser.
- **Database:** SQLite3 (`portfolio.db`) with `messages` and `portfolio_content` tables.
- **Tooling & Build:** Concurrently, Vite Build.

---

## 🌟 Key Features

1. **Responsive Glassmorphic UI:** Modern dark/light theme switching with glowing orb background effects and fluid responsive layouts.
2. **Live Admin CMS Editor:** Unlocked via admin password (configured securely in `.env`) to update bio, skills toolkit, project cards, experience, and certificates directly to the SQLite database.
3. **Personal AI Portfolio Assistant:** Grounded floating chatbot (`AIChatbot.jsx`) answering questions strictly about Ratish's skills, projects, CGPA, and internship, featuring 1-click prompt chips and a Refresh button.
4. **Dynamic Resume Preview & Download:** Embedded resume preview modal with printable HTML rendering and raw markdown download options.
5. **SQLite Contact Message Storage:** Persistent contact form submission engine saving all incoming recruiter messages directly into `portfolio.db`.

---

## 🚀 Setup & Installation Guide

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
Starts both the Express backend server (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

### 4. Build & Run Production Bundle
To build production static assets and serve the application via Express:
```bash
npm run build
npm run server
```
Access the production application at: `http://localhost:5000`

---

## 🔄 Project Workflow & Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 React.js Frontend (Vite)                    │
│  (Hero, About, Skills, Projects, Experience, Contact, AI)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST API Calls
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express.js Backend Server                   │
│              (server/server.js - Port 5000)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQLite3 Connection (db.js)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               SQLite Database (portfolio.db)                │
│     (Tables: `messages` | Table: `portfolio_content`)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Checks server health and database connection status |
| `GET` | `/api/content` | Retrieves current live portfolio content from SQLite DB |
| `PUT` | `/api/content` | Updates portfolio content in SQLite DB (Requires `X-Admin-Password`) |
| `POST` | `/api/contact` | Saves new contact form message to SQLite `messages` table |
| `GET` | `/api/messages` | Fetches all stored contact messages ordered by timestamp |

---

## 📝 License
Created for **Ratish Kannur**'s engineering portfolio & career applications.
