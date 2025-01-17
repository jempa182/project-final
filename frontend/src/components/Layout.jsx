// src/components/Layout.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

const Layout = ({ children }) => {
  const { user, logout } = useUser();
  const { itemCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b relative">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl">
            <img 
              src="/assets/jenny-logo.png"
              alt="Jenny Andersén"
              className="h-8 w-auto"
            />
          </Link>
          
          <nav className="flex items-center space-x-8">
            <div className="relative">
              <button 
                onClick={() => user && setShowDropdown(!showDropdown)}
                className="text-gray-800 hover:text-gray-600 text-sm flex items-center gap-2"
              >
                <img 
                  src="/assets/profile-icon.svg"
                  alt="Profile"
                  className="w-4 h-4"
                />
                {user ? user.firstName : (
                  <Link to="/login">LOGIN</Link>
                )}
              </button>

              {/* Dropdown Menu */}
              {showDropdown && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <Link 
              to="/cart" 
              className="text-gray-800 hover:text-gray-600 text-sm"
            >
              CART ({itemCount})
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;