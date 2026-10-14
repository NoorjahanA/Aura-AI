# Neumorphic AI Chatbot — MERN Stack

An AI chatbot application crafted with a tactile **Neumorphic design system**, dual **Light/Dark palettes**, and powered by the **NVIDIA Nemotron-3 Ultra 550B** reasoning model via the OpenRouter API.

---

## 🌟 Key Features

1. **Tactile Neumorphic UI Design**:
   - **Unique Light Theme**: Mineral Alabaster & Ethereal Clay palette with crisp slate typography (`#192131`) and soft dual drop/inset shadows.
   - **Unique Dark Theme**: Obsidian Titanium & Bioluminescent Teal palette with luminous pearl typography (`#f3f6fc`) and recessed lighting.
   - **Tactile Switches & Buttons**: Real tactile button press animations (`:active` inset well compressions).

2. **Full MERN Stack Architecture**:
   - **Frontend**: React 19 + Vite with modular components, custom CSS tokens, and context managers.
   - **Backend**: Express.js with Server-Sent Events (SSE) streaming proxy and Mongoose data models.
   - **Database**: MongoDB (Mongoose models for `User` and `Conversation`), with automatic resilient fallback for local sessions.

3. **Step-by-Step Reasoning & OpenRouter Streaming**:
   - Integrated with **`nvidia/nemotron-3-ultra-550b-a55b:free`**.
   - Displays real-time **Step-by-Step Reasoning tokens** inside a collapsible thinking accordion.
   - Preserves `reasoning_details` throughout multi-turn conversations for context continuity.

4. **Complete Layout Specifications**:
   - **Left Sidebar**: Searchable chat history, "New Conversation" button, and conversation deletion.
   - **Left Side Bottom**: User account card with avatar, connection status, and Sign In / Sign Out modal.
   - **Top Bar**: Active conversation tab title, model status pill, and **tactile Dark/Light theme switch in the top right corner**.
   - **Chat View**: Markdown code blocks, copy buttons, suggestion chips, and responsive drawer on mobile.

---

## 📂 Project Folder Structure

```
AI-Chatbot/
├── frontend/                            # Frontend React + Vite Application
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/                  # Modular Neumorphic UI Components
│   │   │   ├── Auth/
│   │   │   │   └── AuthModal.jsx        # Login & Sign Up modal
│   │   │   ├── Chat/
│   │   │   │   ├── ChatArea.jsx         # Message feed & empty-state showcase
│   │   │   │   ├── ChatHeader.jsx       # Header tab, model badge & theme switch
│   │   │   │   ├── ChatInput.jsx        # Sunken input bar & suggestion chips
│   │   │   │   ├── MessageBubble.jsx    # Neumorphic message bubble & code styling
│   │   │   │   └── ReasoningBox.jsx     # Collapsible step-by-step thinking block
│   │   │   ├── Sidebar/
│   │   │   │   ├── ChatHistoryList.jsx  # Search & conversation sessions
│   │   │   │   ├── Sidebar.jsx          # Left drawer & branding
│   │   │   │   └── UserAccount.jsx      # Left-bottom account card & login/logout
│   │   │   └── UI/
│   │   │       └── ThemeToggle.jsx      # Top-right tactile slider switch
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Auth state & token storage
│   │   │   ├── ChatContext.jsx          # Chat streaming, active conversation & CRUD
│   │   │   └── ThemeContext.jsx         # Neumorphic theme engine (Light/Dark)
│   │   ├── services/
│   │   │   ├── api.js                   # Conversation and user endpoints
│   │   │   └── openRouterService.js     # SSE streaming & reasoning tokens handler
│   │   ├── styles/
│   │   │   └── neumorphic.css           # Core Neumorphic Design Tokens & Shadows
│   │   ├── App.jsx                      # App root container
│   │   ├── index.css                    # Global typography & layout
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                             # Backend Express & MongoDB API
│   ├── config/
│   │   └── db.js                        # Resilient MongoDB connection
│   ├── controllers/
│   │   ├── authController.js            # Login, registration, profile
│   │   └── chatController.js            # Conversations CRUD & OpenRouter SSE stream
│   ├── middleware/
│   │   └── authMiddleware.js            # JWT verification middleware
│   ├── models/
│   │   ├── Conversation.js              # Mongoose conversation & messages schema
│   │   └── User.js                      # Mongoose user account schema
│   ├── routes/
│   │   ├── authRoutes.js                # Auth endpoints
│   │   └── chatRoutes.js                # Chat & streaming endpoints
│   ├── .env                             # Environment variables
│   ├── package.json
│   └── server.js                        # Server entry point
│
├── .env.example                         # Example environment variables
├── package.json                         # Root orchestration script
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Start Both Frontend & Backend Concurrently
From the project root directory:
```bash
npm run dev
```

Or run them individually:
```bash
# Start Backend Server (port 5000)
npm run backend

# Start Frontend Client (port 5173)
npm run frontend
```

### 2. Access the Application
Open your browser at:
```
http://localhost:5173/
```

- **Backend Health Check**: `http://localhost:5000/api/health`
- **Default OpenRouter Model**: `nvidia/nemotron-3-ultra-550b-a55b:free`
