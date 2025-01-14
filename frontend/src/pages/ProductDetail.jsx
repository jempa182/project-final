import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [print, setPrint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrint = async () => {
      try {
        const response = await fetch(`http://localhost:8080/prints/${id}`);
        const data = await response.json();
        if (data.success) {
          setPrint(data.print);
        }
      } catch (error) {
        console.error('Error fetching print:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrint();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!print) {
    return <div>Print not found</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left side - Image */}
        <div>
          <div className="aspect-square bg-gray-100">
            <img
              src={print.imageUrl}
              alt={print.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right side - Product Info */}
        <div className="space-y-8 py-4">
          {/* Product Title and Price */}
          <div>
            <h1 className="text-2xl mb-2">{print.name}</h1>
            <p className="text-xl">{print.price} kr</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-700">{print.description}</p>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors">
            ADD TO CART
          </button>

          {/* Shipping Information */}
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