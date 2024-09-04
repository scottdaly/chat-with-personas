import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ChatDashboard from "./ChatDashboard";
import Navbar from "./components/Navbar";

function App() {
  const { isLoggedIn, user, handleLogin, handleLogout } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar 
            isLoggedIn={isLoggedIn} 
            user={user} 
            onLogin={handleLogin} 
            onLogout={handleLogout} 
          />
          <div className="container mx-auto px-4 py-8 max-w-2xl flex-grow">
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
      <h2 className="text-2xl font-semibold mb-4">Welcome to AI Personas Chat</h2>
      <p className="mb-6">Engage in meaningful conversations with various AI personas tailored for different topics and expertise.</p>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Key Features:</h3>
        <ul className="list-disc list-inside text-left">
          <li>Choose from a variety of AI personas with different expertise</li>
          <li>Get expert insights and advice on various topics</li>
          <li>Enjoy natural, context-aware conversations</li>
          <li>Learn and explore new subjects with AI-powered guidance</li>
          <li>Save and review your chat history for future reference</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">How It Works:</h3>
        <ol className="list-decimal list-inside text-left">
          <li>Log in with your Google account</li>
          <li>Select an AI persona that matches your interests or needs</li>
          <li>Start chatting and asking questions</li>
          <li>Receive personalized responses and insights</li>
          <li>Switch between personas to explore different topics</li>
        </ol>
      </div>
      
      <p className="mb-6">Ready to start your AI-powered conversation journey?</p>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
      >
        Login with Google to Begin
      </button>
      
      <div className="mt-8 text-sm text-gray-600">
        <p>By logging in, you agree to our <Link to="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.</p>
      </div>
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
