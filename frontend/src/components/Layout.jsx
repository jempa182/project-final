// src/components/Layout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with your name on left, login/cart on right */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl">
            <img 
              src="./public/assets/jenny-logo.png" 
              alt="Jenny Andersén"
              className="h-14 w-auto" // Maintaining height but allowing width to scale
            />
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link 
              to="/login" 
              className="text-gray-800 hover:text-gray-600 text-sm"
            >
              LOGIN
            </Link>
            <Link 
              to="/cart" 
              className="text-gray-800 hover:text-gray-600 text-sm"
            >
              CART (0)
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;