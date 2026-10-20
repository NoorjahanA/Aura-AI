<div align="center">

# 🌌 Aura AI — Minimalist Neumorphic AI Chatbot

<p align="center">
  <strong>A full-stack MERN conversational AI workspace crafted with a tactile Neumorphic design system, dual ambient themes, and powered by NVIDIA Nemotron-3 Ultra 550B via OpenRouter.</strong>
</p>

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Cloudflare](https://img.shields.io/badge/Frontend-Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com/)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-6366F1?style=for-the-badge)](https://openRouter.ai/)

---

### 🌐 [Live Frontend App](https://aura-ai.noorjahana995.workers.dev) • ⚡ [Live Backend API](https://aura-ai-c4df.onrender.com/api/health) • 📦 [GitHub Repository](https://github.com/NoorjahanA/Aura-AI)

---

</div>

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Design System & Aesthetics](#-design-system--aesthetics)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Configuration](#-environment-configuration)
- [API Reference](#-api-reference)
- [Getting Started Locally](#-getting-started-locally)
- [Cloud Deployment](#-cloud-deployment)
- [License](#-license)

---

## 🔮 Overview

**Aura AI** is a production-grade conversational AI platform built on the **MERN** stack. It bridges cutting-edge LLM reasoning with a meticulously engineered **Neumorphic (Soft UI)** user interface.

Unlike traditional flat chat interfaces, Aura AI utilizes physical light and shadow simulations, realistic tactile button press behaviors, and ambient inset elements that feel natural, fluid, and delightful to interact with.

```
       ┌────────────────────────────────────────────────────────┐
       │                       Aura AI                          │
       │                                                        │
       │   [Sidebar]       [Active Conversation Header]   [☼/☽] │
       │   - New Chat      - NVIDIA Nemotron-3 550B             │
       │   - Sessions      ───────────────────────────────────  │
       │   - Search        [AI Message Bubble]                  │
       │                   "Here is your answer with deep..."   │
       │                                                        │
       │   [User Card]     [  Type your message here...  ] [➔]  │
       └────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🧠 Intelligent Reasoning Engine
- **Powered by NVIDIA Nemotron-3 Ultra 550B** (`nvidia/nemotron-3-ultra-550b-a55b:free`) through OpenRouter.
- **Real-Time Token Streaming**: Server-Sent Events (SSE) provide low-latency token streaming directly from model to UI.
- **Context Continuity**: Preserves thought traces across multiple conversation turns for seamless logic progression.

### 🎨 Tactile Neumorphic Design
- **Dual Dynamic Themes**:
  - **Light Theme**: Mineral Alabaster (`#eef2f8`) surface with pristine slate typography and balanced ambient drop shadows.
  - **Dark Theme**: Obsidian Titanium (`#0e1015`) surface with luminous text and bioluminescent violet accents.
- **Haptic Inset wells**: Inputs, cards, and toggles simulate tactile depth using complex multi-layer CSS box shadows.
- **Interactive Micro-animations**: Subtle button compressions (`:active` transform scales) and smooth theme transitions.

### 🔐 Full Authentication & Session Management
- **Dual Auth Paths**: Standard Email/Password registration + Google One Tap (GSI) OAuth integration.
- **JWT Protection**: Secure stateless token handling with token persistence in local storage.
- **Session History**: Cloud-synchronized chat histories stored in MongoDB Atlas with complete CRUD operations.

### 🛡️ Cloud-Native & Resilient
- **Graceful Fallbacks**: If database connectivity drops, the system seamlessly operates on an in-memory session store.
- **Cross-Platform Deployment**: Frontend served via Cloudflare edge CDN; backend deployed on Render with automated CI/CD.

---

## 🎨 Design System & Aesthetics

The design uses custom CSS tokens defined in `frontend/src/styles/neumorphic.css`:

| Token | Light Theme (`data-theme="light"`) | Dark Theme (`data-theme="dark"`) | Purpose |
|---|---|---|---|
| `--bg-primary` | `#eef2f8` | `#0e1015` | Global background canvas |
| `--surface` | `#eef2f8` | `#13161d` | Default cards & conversation bubble |
| `--surface-raised`| `#f5f7fc` | `#1a1d26` | Elevated cards, buttons, dropdowns |
| `--text-primary` | `#192131` | `#f3f6fc` | High-contrast readable typography |
| `--accent-color` | `#4f46e5` (Indigo) | `#818cf8` (Soft Violet) | Primary action & highlight accent |
| `--neu-flat` | Dual soft white/grey shadow | Recessed deep glow shadow | Flat tactile card elevation |
| `--neu-pressed` | Dual inset shadow well | Inset dark well | Pressed buttons & active text inputs |

---

## 🏗️ System Architecture

```
                  ┌────────────────────────────────────┐
                  │          End User Browser          │
                  │   Cloudflare Workers / Pages CDN   │
                  │     (React 19 + Vite Frontend)     │
                  └─────────────────┬──────────────────┘
                                    │
                         REST API & │ SSE Stream
                         (HTTPS)    │
                                    ▼
                  ┌────────────────────────────────────┐
                  │       Render Cloud Backend         │
                  │        (Node.js + Express)         │
                  ├─────────────────┬──────────────────┤
                  │   Auth Router   │   Chat Router    │
                  │  (JWT / Bcrypt) │   (SSE Proxy)    │
                  └────────┬────────┴────────┬─────────┘
                           │                 │
            Mongoose / TLS │                 │ OpenRouter API
                           ▼                 ▼
             ┌───────────────────┐    ┌────────────────────┐
             │   MongoDB Atlas   │    │   NVIDIA 550B LLM  │
             │   Cloud Cluster   │    │   (OpenRouter)     │
             └───────────────────┘    └────────────────────┘
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Pure Modern Vanilla CSS Tokens (No Tailwind dependency)
- **Typography**: Plus Jakarta Sans & JetBrains Mono (Google Fonts)

### Backend
- **Runtime**: [Node.js 24 (ESM)](https://nodejs.org/)
- **Server**: [Express.js 4.21](https://expressjs.com/)
- **Database ODM**: [Mongoose 8.9](https://mongoosejs.com/)
- **Security**: [JSON Web Tokens (JWT)](https://jwt.io/), [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- **CORS**: Configured cross-origin resource sharing

### Infrastructure & Cloud
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (M0 Cloud Replica Set)
- **Backend Host**: [Render](https://render.com) (Web Service)
- **Frontend Host**: [Cloudflare Workers](https://workers.cloudflare.com)
- **AI Model Gateway**: [OpenRouter](https://openrouter.ai/)

---

## 📂 Project Directory Structure

```text
AI-Chatbot/
├── frontend/                               # Client Single Page Application (SPA)
│   ├── public/                             # Static assets & icons
│   │   ├── favicon.svg                     # Neumorphic logo SVG
│   │   └── icons.svg                       # Icon sprite asset
│   ├── src/
│   │   ├── components/                     # Modular Neumorphic UI Components
│   │   │   ├── Auth/
│   │   │   │   └── AuthModal.jsx           # Sign in, Sign up & Google OAuth
│   │   │   ├── Chat/
│   │   │   │   ├── ChatArea.jsx            # Message stream & empty welcome state
│   │   │   │   ├── ChatHeader.jsx          # Top bar, model pill & theme toggle
│   │   │   │   ├── ChatInput.jsx           # Sunken input bar & prompt chips
│   │   │   │   ├── MessageBubble.jsx       # Neumorphic chat bubbles & markdown
│   │   │   │   └── ReasoningBox.jsx        # Step-by-step reasoning view
│   │   │   ├── Sidebar/
│   │   │   │   ├── ChatHistoryList.jsx     # Searchable session history list
│   │   │   │   ├── Sidebar.jsx             # Left sliding drawer
│   │   │   │   └── UserAccount.jsx         # User profile card & login trigger
│   │   │   └── UI/
│   │   │       └── ThemeToggle.jsx         # Tactile dual-state toggle slider
│   │   ├── context/                        # React Context state management
│   │   │   ├── AuthContext.jsx             # Auth state, tokens & login flows
│   │   │   ├── ChatContext.jsx             # Active chat, streaming & history
│   │   │   └── ThemeContext.jsx            # Theme state engine (Light/Dark)
│   │   ├── services/
│   │   │   ├── api.js                      # Centralized backend HTTP client
│   │   │   └── openRouterService.js        # SSE streaming & token ingestion
│   │   ├── styles/
│   │   │   └── neumorphic.css              # Neumorphic tokens, shadows & animations
│   │   ├── App.jsx                         # Application container
│   │   ├── index.css                       # Reset styles & typography
│   │   └── main.jsx                        # React root entry point
│   ├── index.html                          # HTML template
│   ├── package.json                        # Frontend dependencies
│   ├── vite.config.js                      # Vite build configuration
│   └── wrangler.json                       # Cloudflare Workers Assets configuration
│
├── backend/                                # REST API & Streaming Server
│   ├── config/
│   │   └── db.js                           # Resilient MongoDB Atlas connector
│   ├── controllers/
│   │   ├── authController.js               # Auth, registration & verification
│   │   └── chatController.js               # Chat endpoints & OpenRouter proxy
│   ├── middleware/
│   │   └── authMiddleware.js               # JWT bearer token verification
│   ├── models/
│   │   ├── Conversation.js                 # Conversations & messages schema
│   │   └── User.js                         # User account schema & password hashing
│   ├── routes/
│   │   ├── authRoutes.js                   # /api/auth routes
│   │   └── chatRoutes.js                   # /api routes (conversations & stream)
│   ├── .env.example                        # Backend environment template
│   ├── package.json                        # Backend dependencies
│   └── server.js                           # Express entry point
│
├── .gitignore                              # Repository exclusion rules
├── package.json                            # Root scripts for monorepo orchestration
├── PROJECT_DOCUMENTATION.md                # Comprehensive architectural manual
└── README.md                               # Project documentation
```

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Listening server port | `5000` (Local) / `10000` (Render) |
| `MONGODB_URI` | MongoDB Atlas SRV connection string | `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/ai_chatbot` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secure_jwt_secret_key` |
| `OPENROUTER_API_KEY`| API key from OpenRouter | `sk-or-v1-...` |
| `OPENROUTER_MODEL`  | Reasoning LLM identifier | `nvidia/nemotron-3-ultra-550b-a55b:free` |
| `CLIENT_URL` | Allowed CORS origin | `*` or `https://aura-ai.noorjahana995.workers.dev` |

### Frontend (`frontend/.env` - Optional)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `https://aura-ai-c4df.onrender.com` |

---

## 📡 API Reference

### Health Check
- **`GET /api/health`**
  ```json
  {
    "status": "online",
    "model": "nvidia/nemotron-3-ultra-550b-a55b:free",
    "database": "MongoDB Connected",
    "timestamp": "2026-10-20T14:02:13.000Z"
  }
  ```

### Authentication
- **`POST /api/auth/register`** — Create an account with `{ name, email, password }`
- **`POST /api/auth/login`** — Authenticate with `{ email, password }`
- **`POST /api/auth/google`** — Verify Google OAuth credential token
- **`GET /api/auth/me`** — Fetch current authenticated user (Requires `Bearer <JWT>`)

### Conversations
- **`GET /api/conversations`** — Retrieve all conversations for the user
- **`POST /api/conversations`** — Create a new conversation
- **`GET /api/conversations/:id`** — Get message history for a conversation
- **`DELETE /api/conversations/:id`** — Delete a conversation

### Real-Time Streaming
- **`POST /api/chat/stream`** — Stream response tokens via Server-Sent Events (SSE)

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- A free **OpenRouter API Key** ([openrouter.ai](https://openrouter.ai))
- A **MongoDB Atlas** cluster (or local MongoDB on `localhost:27017`)

### 1. Clone the Repository
```bash
git clone https://github.com/NoorjahanA/Aura-AI.git
cd Aura-AI
```

### 2. Install Dependencies
Install all root, backend, and frontend dependencies in one command:
```bash
npm run install:all
```

### 3. Setup Environment Variables
Create `backend/.env` based on `.env.example`:
```bash
cp .env.example backend/.env
```
Fill in your `MONGODB_URI`, `JWT_SECRET`, and `OPENROUTER_API_KEY`.

### 4. Run Both Servers Concurrently
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🌐 Cloud Deployment

### Backend Deployment (Render)
1. Link your GitHub repository (`NoorjahanA/Aura-AI`) to [Render](https://render.com).
2. Create a **Web Service**:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add `MONGODB_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`.
3. Render automatically starts the backend and assigns a public URL.

### Frontend Deployment (Cloudflare)
1. Connect the repository to [Cloudflare](https://dash.cloudflare.com).
2. The project contains a pre-configured `frontend/wrangler.json`:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Assets Directory**: `./dist`
   - **SPA Routing**: Handled automatically.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute as you wish.

---

<div align="center">
  Crafted with ❤️ by <a href="https://github.com/NoorjahanA"><strong>Noorjahan A</strong></a>
</div>
