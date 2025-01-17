// src/pages/OrdersPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/profile" className="text-gray-500 hover:text-black">
          ← Back to Profile
        </Link>
        <h1 className="text-2xl">My Orders</h1>
      </div>
      
      <div className="bg-white p-8 border rounded-lg text-center text-gray-500">
        No current or previous orders
      </div>
    </div>
  );
};

export default OrdersPage;