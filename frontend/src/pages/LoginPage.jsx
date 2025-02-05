// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const LoginPage = () => {
 const [isLogin, setIsLogin] = useState(true);
 const [firstName, setFirstName] = useState('');
 const [lastName, setLastName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const { login } = useUser();
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
   e.preventDefault();
   setError('');
   
   if (isLogin) {
     const result = await login(email, password);
     if (result.success) {
       navigate('/');
     } else {
       setError(result.message);
     }
   } else {
     try {
       const response = await fetch('http://localhost:8080/auth/signup', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ 
           firstName, 
           lastName, 
           email, 
           password 
         }),
       });
       const data = await response.json();
       
       if (data.success) {
         const loginResult = await login(email, password);
         if (loginResult.success) {
           navigate('/');
         }
       } else {
         setError(data.message);
       }
     } catch (error) {
       setError('An error occurred during signup');
     }
   }
 };

 return (
  <div className="max-w-md mx-auto mt-20 mb-20 py-12 px-6">
    <div className="flex justify-center space-x-4 mb-8">
      <button 
        onClick={() => setIsLogin(true)}
        className={`pb-2 px-4 ${isLogin ? 'border-b-2 border-black' : ''}`}
      >
        Login
      </button>
      <button 
        onClick={() => setIsLogin(false)}
        className={`pb-2 px-4 ${!isLogin ? 'border-b-2 border-black' : ''}`}
      >
        Sign Up
      </button>
    </div>

    {error && (
      <div className="bg-red-50 text-red-500 p-3 mb-4 rounded">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border rounded"
              required={!isLogin}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded"
              required={!isLogin}
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button 
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
    </form>
  </div>
);
};

export default LoginPage;