import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = "https://venturementor.co/api";

function ChatDashboard() {
  const { user } = useAuth();
  const { personaId } = useParams();
  const [personas, setPersonas] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    fetchPersonas();
  }, []);

  useEffect(() => {
    // Reset chat when personaId changes
    setChat([]);
    setConversationId(null);
  }, [personaId]);

  const fetchPersonas = async () => {
    console.log("About to fetch personas");
    try {
      const response = await axios.get(`${API_BASE_URL}/personas`);
      console.log("persona response.data", response.data);
      console.log("Is it an array?", Array.isArray(response.data));
      setPersonas(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching personas:", error);
      setPersonas([]);
    }
  };

  const handleSendMessage = async () => {
    if (!personaId || !message.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        conversation_id: conversationId,
        persona_id: parseInt(personaId),
        message: message,
      });
      setChat((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "ai", content: response.data.response },
      ]);
      setMessage("");
      setConversationId(response.data.conversation_id);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p>Welcome, {user?.email}</p>
      </div>

      {isLoading && !personaId ? (
        <div>Loading...</div>
      ) : (
        <div>
          {!personaId ? (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {personas.map((persona) => (
                <Link
                  key={persona.ID}
                  to={`/chat/${persona.ID}`}
                  className="bg-blue-100 p-4 rounded hover:bg-blue-200 transition duration-300"
                >
                  {persona.name}
                </Link>
              ))}
            </div>
          ) : (
            <>
              <div className="flex mb-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border border-gray-300 rounded-l"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r disabled:bg-blue-300"
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
              <div className="border border-gray-300 rounded h-96 overflow-y-auto p-4">
                {chat.length > 0 ? (
                  chat.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 p-2 rounded ${
                        msg.role === "user" ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      <strong className="font-bold">
                        {msg.role === "user" ? "You" : "AI"}:
                      </strong>{" "}
                      {msg.content}
                    </div>
                  ))
                ) : (
                  <div>No chat history</div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatDashboard;
