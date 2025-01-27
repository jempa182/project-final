// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost:8080/favorites', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setFavorites(data.favorites);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  if (isLoading) {
    return <div>Loading favorites...</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <h1 className="text-2xl mb-4">My Favorites</h1>
        <p>You haven't added any favorites yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <h1 className="text-2xl mb-8">My Favorites</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((print) => (
          <Link 
            to={`/products/${print._id}`} 
            key={print._id} 
            className="group"
          >
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
                <img 
                  src={print.mainImage}
                  alt={print.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h2 className="text-gray-800">{print.name}</h2>
                <p className="text-gray-800">{print.price} kr</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;