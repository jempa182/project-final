import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { Menu, X } from 'lucide-react';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { user, logout } = useUser();
  const { itemCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <header className="border-b relative">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl">
            <img 
              src="/assets/jenny-logo.png"
              alt="Jenny Andersén"
              className="h-12 w-auto max-w-full"
            />
          </Link>

          {/* Cart button stays outside the menu */}
          <div className="flex items-center space-x-4 sm:hidden">
            <Link to="/cart" className="text-gray-800 hover:text-gray-600">
              CART ({itemCount})
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Navigation for larger screens */}
          <nav className="hidden sm:flex items-center space-x-4 sm:space-x-8 font-custom text-sm">
            <Link to="/about" className="text-gray-800 hover:text-gray-600">
              ABOUT
            </Link>
            <div className="relative">
              <button 
                onClick={() => user && setShowDropdown(!showDropdown)}
                className="text-gray-800 hover:text-gray-600 flex items-center gap-2"
              >
                <img 
                  src="/assets/profile-icon.svg"
                  alt="Profile"
                  className="w-4 h-4"
                />
                {user ? user.firstName.toUpperCase() : (
                  <Link to="/login">LOGIN</Link>
                )}
              </button>
              {showDropdown && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-10">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>Profile</Link>
                  <Link to="/favorites" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>My Favorites</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
            <Link to="/cart" className="text-gray-800 hover:text-gray-600">
              CART ({itemCount})
            </Link>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 w-full bg-white border-t shadow-md z-10">
            <nav className="flex flex-col items-center py-4 space-y-4">
              <Link to="/about" className="text-gray-800 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                ABOUT
              </Link>
              <Link to={user ? "/profile" : "/login"} className="text-gray-800 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                {user ? 'PROFILE' : 'LOGIN'}
              </Link>
              {user && (
                <button onClick={handleLogout} className="text-gray-800 hover:text-gray-600">
                  LOGOUT
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
