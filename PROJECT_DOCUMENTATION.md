# 📚 Full Project Architectural & Student Guide: Neumorphic MERN AI Chatbot

> A comprehensive, step-by-step master document explaining how the application was built, every library used, how each page and component works, and how to run it.

---

## 📑 Table of Contents
1. [Project Overview & Core Mission](#1-project-overview--core-mission)
2. [Master Architecture (MERN Stack Flow)](#2-master-architecture-mern-stack-flow)
3. [Complete Library & Dependency Breakdown](#3-complete-library--dependency-breakdown)
4. [File & Directory Structure Walkthrough](#4-file--directory-structure-walkthrough)
5. [Page & UI Component Details](#5-page--ui-component-details)
6. [Design System: Neumorphism & Smooth Dual Palettes](#6-design-system-neumorphism--smooth-dual-palettes)
7. [AI Streaming Engine & Reasoning Mechanism](#7-ai-streaming-engine--reasoning-mechanism)
8. [Database Schemas & Authentication Security](#8-database-schemas--authentication-security)
9. [Step-by-Step Message Lifecycle](#9-step-by-step-message-lifecycle)
10. [How to Run and Test the Application](#10-how-to-run-and-test-the-application)

---

## 1. Project Overview & Core Mission

This application is an **AI Chatbot Web Application** built using the **MERN** stack (MongoDB, Express, React, Node.js). 

### Key Characteristics:
- **Unique Neumorphic Visual Language**: Uses soft dual-cast highlights and drop/inset shadows rather than generic flat boxes.
- **Harmonized Light & Dark Themes**: Both themes share the same 220° slate color temperature, creating a natural ambient lighting change with a synchronized 0.4s transition.
- **Deep Step-by-Step Reasoning**: Connects to the **NVIDIA Nemotron-3 Ultra 550B** reasoning model via OpenRouter API, extracting the model's internal chain-of-thought tokens into a collapsible, monospace thinking accordion before displaying the final answer.
- **Session & User Persistence**: Automatically stores chat sessions, message histories, and user profiles inside MongoDB.

---

## 2. Master Architecture (MERN Stack Flow)

```
+-----------------------------------------------------------------------------------------+
|                                    BROWSER (Client)                                     |
|  +------------------+   +------------------------------------+   +-------------------+  |
|  |  Theme Context   |   |        Chat Area & Reasoning       |   |   Auth Modal      |  |
|  |  (Light / Dark)  |   |        (React 19 + Lucide)         |   |   (Login/Signup)  |  |
|  +------------------+   +------------------------------------+   +-------------------+  |
+--------------------------------------------|--------------------------------------------+
                                             | HTTP Requests / Server-Sent Events (SSE)
                                             v
+-----------------------------------------------------------------------------------------+
|                                  SERVER (Node.js + Express)                             |
|  +---------------------+   +---------------------------+   +-------------------------+  |
|  |  Auth Middleware    |   |    Controllers & Routes   |   |   SSE Streaming Proxy   |  |
|  |  (JWT Verification) |   |    (Bcrypt Password Hash) |   |   (Buffer & Keepalives) |  |
|  +---------------------+   +---------------------------+   +-------------------------+  |
+------------------------------|---------------------------------------------|------------+
                               |                                             |
             Mongoose Queries  |                           SSE Stream POST   |
                               v                                             v
               +-------------------------------+             +-------------------------------+
               |           DATABASE            |             |           AI CLOUD            |
               |            MongoDB            |             |          OpenRouter           |
               | (Users, Conversations, Msgs)  |             |      (Nemotron-3 Ultra)       |
               +-------------------------------+             +-------------------------------+
```

---

## 3. Complete Library & Dependency Breakdown

### Root Directory (`/package.json`)
| Library | Version | Why We Used It |
| :--- | :--- | :--- |
| **`concurrently`** | `^9.1.2` | Allows running multiple npm commands concurrently from a single terminal window. Instead of opening two terminal tabs for client and server, running `npm run dev` in the root launches both simultaneously. |

---

### Backend Server (`/backend/package.json`)
| Library | Version | What It Does & Why We Chose It |
| :--- | :--- | :--- |
| **`express`** | `^4.21.2` | The de facto HTTP server framework for Node.js. It manages routing (`/api/auth`, `/api/conversations`), middleware, HTTP headers, and Server-Sent Event (SSE) streaming connections. |
| **`mongoose`** | `^8.9.5` | Object Data Modeling (ODM) library for MongoDB. It provides schema validation, pre-save lifecycle hooks (for automatic password hashing), type safety, and database connection pooling. |
| **`bcryptjs`** | `^3.0.3` | Pure JavaScript implementation of the bcrypt cryptographic hash algorithm. We use it to salt and hash user passwords (with 10 rounds) so plaintext passwords are never stored in the database. |
| **`jsonwebtoken`** | `^9.0.2` | Used to sign and verify stateless JWT tokens. When a user logs in, the server generates a signed token containing their user ID and email, enabling secure API authentication. |
| **`cors`** | `^2.8.5` | Cross-Origin Resource Sharing middleware. Allows the browser client running on `http://localhost:5173` to safely communicate with the backend server running on `http://localhost:5000`. |
| **`dotenv`** | `^16.4.7` | Loads secret configuration variables (MongoDB URI, JWT secret, OpenRouter API Key, Port) from the private `.env` file into Node's `process.env` runtime object. |

---

### Frontend Client (`/frontend/package.json`)
| Library | Version | What It Does & Why We Chose It |
| :--- | :--- | :--- |
| **`react`** | `^19.2.8` | Modern declarative UI component library. It handles component rendering, state hooks (`useState`, `useEffect`, `useRef`), and global application context. |
| **`react-dom`** | `^19.2.8` | Renders the React component tree into the real browser Document Object Model (DOM). |
| **`vite`** | `^8.3.0` | Next-generation frontend build tool and development server. Offers instant server start, lightning-fast Hot Module Replacement (HMR), and optimized production bundling. |
| **`lucide-react`** | `^1.55.0` | Clean, customizable SVG icon library. Used for icons across the app (Sun, Moon, Brain, Bot, Send, Trash, User, Search, Sparkles, Copy, Check). |

---

## 4. File & Directory Structure Walkthrough

```
AI-Chatbot/
├── frontend/
│   ├── public/
│   │   └── favicon.svg              # App tab icon
│   ├── src/
│   │   ├── components/              # Modular UI elements
│   │   │   ├── Auth/
│   │   │   │   └── AuthModal.jsx    # Sign In & Sign Up popup dialog
│   │   │   ├── Chat/
│   │   │   │   ├── ChatArea.jsx     # Message list container & auto-scroll
│   │   │   │   ├── ChatHeader.jsx   # Top bar with title and theme switch
│   │   │   │   ├── ChatInput.jsx    # Sunken input box & prompt suggestions
│   │   │   │   ├── MessageBubble.jsx# Neumorphic user/assistant message cards
│   │   │   │   └── ReasoningBox.jsx # Step-by-step thinking trace accordion
│   │   │   ├── Sidebar/
│   │   │   │   ├── ChatHistoryList.jsx # Search bar & past conversation list
│   │   │   │   ├── Sidebar.jsx      # Left drawer container & app branding
│   │   │   │   └── UserAccount.jsx  # Bottom-left user profile & login button
│   │   │   └── UI/
│   │   │       └── ThemeToggle.jsx  # Tactile Light/Dark sliding switch
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication state & JWT handling
│   │   │   ├── ChatContext.jsx      # Active chat, streaming logic & CRUD
│   │   │   └── ThemeContext.jsx     # Dark/Light theme toggle & storage
│   │   ├── services/
│   │   │   ├── api.js               # REST client for conversation endpoints
│   │   │   └── openRouterService.js # SSE streaming reader & chunk parser
│   │   ├── styles/
│   │   │   └── neumorphic.css       # Core CSS design tokens, shadows & animations
│   │   ├── App.jsx                  # Root React application layout
│   │   ├── index.css                # Fullscreen layout & responsive drawer rules
│   │   └── main.jsx                 # Client entry point
│   ├── index.html                   # HTML template with Google Fonts
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js                    # Resilient MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js        # Register, Login (Bcrypt + JWT) & Profile
│   │   └── chatController.js        # Conversation CRUD & OpenRouter SSE proxy
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT header validation middleware
│   ├── models/
│   │   ├── Conversation.js          # Mongoose schema for conversations & reasoning
│   │   └── User.js                  # Mongoose schema for users with Bcrypt pre-save
│   ├── routes/
│   │   ├── authRoutes.js            # Express router for /api/auth/*
│   │   └── chatRoutes.js            # Express router for /api/conversations & stream
│   ├── .env                         # Server environment variables & API keys
│   ├── package.json
│   └── server.js                    # Express server entry point (port 5000)
│
├── .env.example                     # Environment reference template
├── package.json                     # Root orchestrator script
├── README.md                        # Quick-start documentation
└── PROJECT_DOCUMENTATION.md         # This comprehensive master guide
```

---

## 5. Page & UI Component Details

### A. Sidebar Component (`Sidebar.jsx`)
- **Location**: Left sidebar (`width: 310px`).
- **Branding**: Displays the app logo with a gradient badge and title **Aura AI**.
- **Responsive Drawer**: On mobile screens (`<= 820px`), slides offscreen and toggles via the top-left hamburger button with an ambient backdrop overlay.

### B. Chat History List (`ChatHistoryList.jsx`)
- **New Conversation Button**: Tactile neumorphic button that starts a fresh chat session.
- **Search Bar**: Real-time keyword filter input with inset shadows that searches conversation titles.
- **Conversation Items**: Lists past chats with active indicator highlights and a delete trash can button.

### C. User Account Card (`UserAccount.jsx`)
- **Location**: Bottom of the left sidebar.
- **When Logged Out (Guest Mode)**: Displays a guest avatar, "Guest Explorer", a connection dot, and a "Sign In" button that triggers `AuthModal`.
- **When Logged In**: Displays user avatar, name, email address, a green status dot, and a logout button.

### D. Authentication Modal (`AuthModal.jsx`)
- **Location**: Centered overlay modal with backdrop blur.
- **Features**:
  - Tab switch between **Sign In** and **Sign Up**.
  - Form validation: Name, Email, Password (minimum 6 characters).
  - **Form State Cleanup**: Automatically clears all input fields and errors upon successful login/registration, when the modal is closed, or when switching tabs.

### E. Chat Header (`ChatHeader.jsx`)
- **Location**: Top of the main chat container (`height: 68px`).
- **Components**:
  - Mobile hamburger toggle button.
  - Active conversation title badge.
  - Reasoning Visibility toggle button (collapses/expands all reasoning boxes).
  - **Theme Toggle Switch** in the far right corner.

### F. Theme Toggle Switch (`ThemeToggle.jsx`)
- **Location**: Top right corner.
- **Design**: An inset neumorphic groove (`width: 68px`, `height: 34px`) featuring a tactile circular sliding knob containing Sun and Moon icons with a spring-like cubic-bezier transition.

### G. Chat Area (`ChatArea.jsx`)
- **Location**: Main scrollable message viewport.
- **Empty State**: Displays a welcome card with three feature highlights (Internal Reasoning, Tactile Neumorphism, Context Continuity).
- **Auto-scroll**: A React `useRef` automatically scrolls to the newest message whenever new text or streaming tokens arrive.

### H. Message Bubble (`MessageBubble.jsx`)
- **User Messages**: Sleek extruded bubbles aligned to the right.
- **Assistant Messages**: Soft raised cards aligned to the left with avatar, copy button (with checkmark confirmation), formatted code blocks, and the collapsible `ReasoningBox`.

### I. Reasoning Box (`ReasoningBox.jsx`)
- **Role**: Visualizes the AI model's step-by-step thinking process.
- **UI Details**:
  - Expandable/collapsible accordion header with brain icon.
  - Shimmer animation while reasoning tokens are actively generating.
  - Monospace font (`JetBrains Mono`) for readability.

### J. Chat Input (`ChatInput.jsx`)
- **Location**: Bottom of the chat viewport.
- **Features**:
  - Suggestion chips when a chat is new (e.g., *"How many r's are in strawberry?"*).
  - Auto-growing multiline textarea (Enter to send, Shift+Enter for newline).
  - Send button with tactile push animation, and a Stop generation button when streaming.

---

## 6. Design System: Neumorphism & Smooth Dual Palettes

Neumorphism simulates physical lighting across identical surfaces using pairs of drop shadows.

```css
/* Light Neumorphic Variables */
--bg-primary: #eef1f5;
--surface: #eef1f5;
--surface-raised: #f5f7fa;
--neu-flat: 6px 6px 14px #cfd6e2, -6px -6px 14px #ffffff;
--neu-pressed: inset 4px 4px 8px #cfd6e2, inset -4px -4px 8px #ffffff;

/* Dark Neumorphic Variables */
--bg-primary: #1c1f26;
--surface: #1c1f26;
--surface-raised: #222630;
--neu-flat: 6px 6px 15px #13151a, -6px -6px 15px #252932;
--neu-pressed: inset 4px 4px 8px #121419, inset -4px -4px 8px #262a33;
```

### Why the Theme Switch is Smooth:
1. **Identical Chromatic Temperature**: Both light (`#eef1f5`) and dark (`#1c1f26`) share a cool 220° slate blue undertone.
2. **Synchronized Global Transition**:
   ```css
   html, body, div, aside, main, header, section, button, input, textarea, span, p, h1, h2, h3, pre {
     transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                 color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                 box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                 border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
   }
   ```
   This ensures that every element and shadow transition at the exact same pace with no jarring visual flashes.

---

## 7. AI Streaming Engine & Reasoning Mechanism

We use the **NVIDIA Nemotron-3 Ultra 550B** reasoning model hosted on OpenRouter (`nvidia/nemotron-3-ultra-550b-a55b:free`).

### How Reasoning Works:
1. When a prompt is submitted, the model generates an internal **reasoning stream** (`delta.reasoning` / `reasoning_details`) before generating its final answer (`delta.content`).
2. Our backend and client stream parser captures both:
   ```javascript
   if (delta?.reasoning) {
     onReasoningDelta(delta.reasoning); // Renders inside ReasoningBox
   }
   if (delta?.content) {
     onDelta(delta.content);            // Renders final answer text
   }
   ```
3. **Context Preservation**: OpenRouter guidelines specify that multi-turn chats must send back the `reasoning_details` array so the model preserves its logic chain across subsequent turns.

---

## 8. Database Schemas & Authentication Security

### User Schema (`User.js`)
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() { return !this.googleId; }, 
    minlength: 6 
  },
  googleId: { type: String, default: null, sparse: true },
  avatar: { type: String, default: '' },
  settings: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    reasoningVisible: { type: Boolean, default: true }
  }
}, { timestamps: true });
```
- **Bcrypt Pre-save Hook**: Hashes passwords with 10 salt rounds before saving (skipped for OAuth users).
- **Password Comparison**: Uses `user.comparePassword(candidatePassword)` on email login.
- **Google OAuth Authentication**: `/api/auth/google` handles Google Identity Services tokens and direct Google profile authentication, generating a signed JWT and linking conversations.

### Conversation Schema (`Conversation.js`)
```javascript
const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, default: '' },
  reasoning: { type: String, default: '' },
  reasoning_details: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  title: { type: String, default: 'New Neumorphic Chat' },
  model: { type: String, default: 'nvidia/nemotron-3-ultra-550b-a55b:free' },
  messages: [messageSchema]
}, { timestamps: true });
```

---

## 9. Step-by-Step Message Lifecycle

```
[1] User types prompt & presses Enter
                    |
[2] ChatContext appends message to UI instantly (optimistic update)
                    |
[3] POST /api/chat/stream initiated via fetch with AbortSignal
                    |
[4] Express chatController opens SSE connection (text/event-stream)
                    |
[5] OpenRouter stream chunks arrive:
     - Keep-alives (': OPENROUTER PROCESSING') are safely filtered
     - Reasoning tokens stream into ReasoningBox
     - Content tokens stream into MessageBubble
                    |
[6] Stream finishes with [DONE]
                    |
[7] Express saves user & assistant message + reasoning details into MongoDB
                    |
[8] Active conversation title automatically updates based on user query
```

---

## 10. How to Run and Test the Application

### 1. Start Both Client & Server Concurrently
From the root workspace directory (`d:\Professional\Training\AI-Chatbot`):
```powershell
npm run dev
```

### 2. Verify Server Status
- **Client Web UI**: [http://localhost:5173](http://localhost:5173)
- **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Verify Database Contents
To verify stored documents in MongoDB:
```powershell
cd backend
node -e "import('mongoose').then(async m => { await m.default.connect('mongodb://127.0.0.1:27017/ai_chatbot'); const docs = await m.default.connection.db.collection('conversations').find().toArray(); console.log(JSON.stringify(docs, null, 2)); await m.default.disconnect(); });"
```
