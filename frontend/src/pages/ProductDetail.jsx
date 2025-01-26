// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [print, setPrint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState('');
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(print);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  useEffect(() => {
    const fetchPrint = async () => {
      try {
        const response = await fetch(`http://localhost:8080/prints/${id}`);
        const data = await response.json();
        if (data.success) {
          setPrint(data.print);
          setCurrentImage(data.print.mainImage);
        }
      } catch (error) {
        console.error('Error fetching print:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrint();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (!print) return <div>Print not found</div>;

  const allImages = [print.mainImage, ...print.additionalImages];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left side - Images */}
        <div>
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 mb-4">
            <img
              src={currentImage}
              alt={print.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(image)}
                className={`aspect-square relative `}
              >
                <img
                  src={image}
                  alt={`${print.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-30 transition-opacity duration-200"/>
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Product Info */}
        <div className="space-y-8 py-4">
          <div>
            <h1 className="text-2xl mb-2">{print.name}</h1>
            <p className="text-xl">{print.price} kr</p>
          </div>

          <div>
            <p className="text-gray-700">{print.description}</p>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-3 transition-all duration-300 ${
              isAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-black hover:bg-gray-800'
            }`}
          >
            <span className={`text-white transition-transform duration-300 ${
              isAdded ? 'inline-block scale-105' : ''
            }`}>
              {isAdded ? 'ADDED TO CART' : 'ADD TO CART'}
            </span>
          </button>

          <div className="border-t pt-6">
            <h2 className="font-medium mb-2">Shipping time & fee</h2>
            <p className="text-gray-700">See detailed information here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;