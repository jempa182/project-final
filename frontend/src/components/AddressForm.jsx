// src/components/AddressForm.jsx
import React, { useState } from 'react';

const AddressForm = ({ onSave, onCancel, existingAddress }) => {
  const [address, setAddress] = useState({
    firstName: existingAddress?.firstName || '',
    lastName: existingAddress?.lastName || '',
    street: existingAddress?.street || '',
    zipCode: existingAddress?.zipCode || '',
    city: existingAddress?.city || '',
    country: existingAddress?.country || '',
    phone: existingAddress?.phone || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(address);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            value={address.firstName}
            onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            value={address.lastName}
            onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Street Address</label>
        <input
          type="text"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">ZIP Code</label>
          <input
            type="text"
            value={address.zipCode}
            onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <input
          type="text"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          value={address.phone}
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Save Address
        </button>
      </div>
    </form>
  );
};

export default AddressForm;