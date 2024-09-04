import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ChatDashboard from "./ChatDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-center mb-8">
            Chat with AI Personas
          </h1>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function Home() {
  const { isLoggedIn, handleLogin } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/chat" />;
  }

  return (
    <div className="text-center">
      <p className="mb-4">Please log in to start chatting.</p>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login with Google
      </button>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

export default App;
