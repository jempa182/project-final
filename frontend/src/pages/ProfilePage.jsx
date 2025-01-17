// src/pages/ProfilePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProfilePage = () => {
  const { user } = useUser();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl mb-8">My Profile</h1>
      
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <h2 className="text-xl mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm">Name</p>
            <p>{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <h2 className="text-xl mb-4">Shipping Address</h2>
        <button className="text-sm text-black underline">
          + Add shipping address
        </button>
      </div>

      {/* Order History */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Order History</h2>
          <span className="text-sm text-gray-500">Total Orders: 0</span>
        </div>
        <Link to="/orders" className="text-black hover:text-gray-700">
          <div className="text-center py-8 text-gray-500">
            No current or previous orders
          </div>
        </Link>
      </div>

      {/* Additional suggestions */}
      <div className="bg-white p-6 rounded-lg border mt-6">
        <h2 className="text-xl mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Newsletter subscription</span>
            <button className="text-sm text-black underline">Subscribe</button>
          </div>
          <div className="flex items-center justify-between">
            <span>Favorite prints</span>
            <Link to="/favorites" className="text-sm text-black underline">
              View favorites (0)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;