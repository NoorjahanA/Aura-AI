import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar.jsx';
import { ChatHeader } from './components/Chat/ChatHeader.jsx';
import { ChatArea } from './components/Chat/ChatArea.jsx';
import { ChatInput } from './components/Chat/ChatInput.jsx';
import { AuthModal } from './components/Auth/AuthModal.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';
import './styles/neumorphic.css';

function ChatApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      {/* Left Sidebar with Chat History & Bottom User Account */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Conversation Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minWidth: 0,
          position: 'relative'
        }}
      >
        {/* Conversation Tab & Top-Right Theme Switch */}
        <ChatHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Chat Area */}
        <ChatArea />

        {/* Bottom Chat Input */}
        <ChatInput />
      </main>

      {/* Auth Modal for Login / Registration */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <ChatApp />
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
