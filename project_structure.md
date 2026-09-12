# GreenCharge AI - Project Structure

A clean, modular, pure JavaScript setup connecting a **React (Vite)** frontend with a **Node.js (Express)** backend.

```text
green-charge-ai/
│
├── public/                       # Static public assets
│   ├── favicon.svg
│   └── icons.svg
│
├── server/                       # Node.js + Express backend
│   ├── index.js                  # Express server entry point & /api routes
│   ├── package.json              # Server dependencies (express, cors, dotenv)
│   ├── .env                      # Server local environment variables (ignored)
│   └── .env.example              # Server environment template
│
├── src/                          # React frontend (Pure JavaScript / JSX)
│   ├── assets/                   # Images and styling assets
│   ├── App.jsx                   # Main React component (server connection test)
│   ├── App.css                   # Component styles & status indicators
│   ├── index.css                 # Global CSS variables & layout
│   └── main.jsx                  # React application DOM entry point
│
├── .env                          # Frontend environment variables (ignored)
├── .env.example                  # Frontend environment template
├── .gitignore                    # Git ignore file (.env, node_modules, dist)
├── index.html                    # Root HTML file
├── package.json                  # Root npm configuration & concurrent scripts
├── run.bat                       # One-click Windows launcher & menu
├── vite.config.js                # Vite build and dev configuration
└── project_structure.md          # Project folder structure guide
```

---

## Quick Reference

| Component | Technology | Default Port | Entry File |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | `http://localhost:5173/` | [src/main.jsx](file:///a:/All%20Android/green-charge-ai/src/main.jsx) |
| **Backend** | Node.js + Express | `http://localhost:5000/api` | [server/index.js](file:///a:/All%20Android/green-charge-ai/server/index.js) |
| **Launcher** | Batch Script | Interactive Menu | [run.bat](file:///a:/All%20Android/green-charge-ai/run.bat) |

---

## Available Commands

- `npm run dev` : Runs both React frontend and Express server concurrently.
- `npm run client` : Runs Vite React frontend only.
- `npm run server` : Runs Express backend only.
- `npm run build` : Builds the production bundle in `dist/`.
