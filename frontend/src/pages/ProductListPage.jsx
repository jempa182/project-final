// src/pages/ProductListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductListPage = () => {
  const [prints, setPrints] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPrints = async () => {
      try {
        const response = await fetch('http://localhost:8080/prints');
        const data = await response.json();
        console.log('API Response:', data); // Let's see what we're getting
        if (data.success) {
          setPrints(data.prints);
        }
      } catch (error) {
        console.error('Error fetching prints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrints();
  }, []);

  if (isLoading) {
    return <div>Loading prints...</div>;
  }

  if (prints.length === 0) {
    return <div>No prints available yet</div>;
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {prints.map((print) => (
          <Link 
            to={`/products/${print._id}`} 
            key={print._id} 
            className="group"
          >
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100">
              {console.log('Image URL:', print.imageUrl)}
                <img 
                  src={print.imageUrl || "/api/placeholder/400/400"}
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

export default ProductListPage;