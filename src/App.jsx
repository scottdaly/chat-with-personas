import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://venturementor.co/api';

function App() {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    checkLoginStatus();
    if (isLoggedIn) {
      fetchPersonas();
    }
  }, [isLoggedIn]);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/status`, { withCredentials: true });
      setIsLoggedIn(response.data.isLoggedIn);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/login`;
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchPersonas = async () => {
    console.log("About to fetch personas");
    try {
      const response = await axios.get(`${API_BASE_URL}/personas`);
      console.log("persona response.data", response.data);
      console.log("Is it an array?", Array.isArray(response.data));
      setPersonas(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching personas:', error);
      setPersonas([]);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedPersona || !message.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        conversation_id: conversationId, // This would be null for a new conversation
        persona_id: parseInt(selectedPersona),
        message: message
      });
      setChat(prev => [...prev, { role: 'user', content: message }, { role: 'ai', content: response.data.response }]);
      setMessage('');
      setConversationId(response.data.conversation_id); // Store the conversation ID for subsequent messages
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Chat with AI Personas</h1>
      
      {!isLoggedIn ? (
        <div className="text-center">
          <p className="mb-4">Please log in to start chatting.</p>
          <button 
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login with Google
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <p>Welcome, {user?.email}</p>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
          
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <select
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              >
                <option value="">Choose a persona</option>
                {Array.isArray(personas) && personas.length > 0 ? (
                  personas.map(persona => (
                    <option key={persona.ID} value={persona.ID}>{persona.name}</option>
                  ))
                ) : (
                  <option value="">No personas found</option>
                )}
              </select>
              <div className="flex mb-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border border-gray-300 rounded-l"
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={isLoading} 
                  className="bg-blue-500 text-white px-4 py-2 rounded-r disabled:bg-blue-300"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
              <div className="border border-gray-300 rounded h-96 overflow-y-auto p-4">
                {Array.isArray(chat) && chat.length > 0 ? (
                  chat.map((msg, index) => (
                    <div key={index} className={`mb-4 p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <strong className="font-bold">{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
                    </div>
                  ))
                ) : (
                  <div>No chat history</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;