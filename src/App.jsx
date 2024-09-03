import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://venturementor.co/api';

function App() {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/personas`);
      setPersonas(response.data);
    } catch (error) {
      console.error('Error fetching personas:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedPersona || !message.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        persona_id: parseInt(selectedPersona),
        message: message
      });
      setChat(prev => [...prev, { role: 'user', content: message }, { role: 'ai', content: response.data.Response }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center mb-8">Chat with AI Personas</h1>
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            <option value="">Choose a persona</option>\
            {personas ? personas.length > 0 ? personas.map(persona => (
              <option key={persona.ID} value={persona.ID}>{persona.Name}</option>
            )) : <option value="">No personas found</option> : <option value="">No personas found</option>}
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
            
            {chat ? chat.length > 0 ? chat.map((msg, index) => (
              <div key={index} className={`mb-4 p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <strong className="font-bold">{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
              </div>
            )) : <div>No chat history</div> : <div>No chat history</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;