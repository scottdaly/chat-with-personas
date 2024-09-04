import React from 'react';
import { useAuth } from '../AuthContext';



function Navbar({ }) {
    const { isLoggedIn, user, handleLogin, handleLogout } = useAuth();

    const onLogin = () => {
        handleLogin();
    }
    
    const onLogout = () => {
        handleLogout();
    }
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">AI Personas Chat</div>
        <div>
          {isLoggedIn ? (
            <div className="flex items-center">
              <span className="text-white mr-4">{user?.email}</span>
              <button 
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition duration-300"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;