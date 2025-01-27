// src/pages/ProductListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProductListPage = () => {
 const [prints, setPrints] = useState([]);
 const [isLoading, setIsLoading] = useState(true); 
 const [hoveredId, setHoveredId] = useState(null);
 const [currentPage, setCurrentPage] = useState(1);
 const { user } = useUser();
 const navigate = useNavigate();
 const [favorites, setFavorites] = useState([]);
 const printsPerPage = 16;

 // Add toggle function:
const toggleFavorite = async (printId) => {
  try {
    const response = await fetch(`http://localhost:8080/favorites/${printId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      setFavorites(prev => 
        prev.includes(printId) 
          ? prev.filter(id => id !== printId)
          : [...prev, printId]
      );
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

 useEffect(() => {
   const fetchPrints = async () => {
     try {
       console.log('Fetching prints from API...');
       const response = await fetch('http://localhost:8080/prints');
       const data = await response.json();
       console.log('Complete API Response:', data);
       console.log('Response data structure:', JSON.stringify(data, null, 2));
       if (data.success) {
         console.log('Setting prints:', data.prints);
         setPrints(data.prints);
       }
     } catch (error) {
       console.error('Detailed error:', error);
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

 const indexOfLastPrint = currentPage * printsPerPage;
 const indexOfFirstPrint = indexOfLastPrint - printsPerPage;
 const currentPrints = prints.slice(indexOfFirstPrint, indexOfLastPrint);
 const totalPages = Math.ceil(prints.length / printsPerPage);

 const paginate = (pageNumber) => setCurrentPage(pageNumber);

 return (
   <>
     {/* Hero Banner - full width */}
     <div className="w-full">
       <div className="relative h-[250px] md:h-[350px] lg:h-[500px]">
         <img
           src="https://images.pexels.com/photos/1831234/pexels-photo-1831234.jpeg"
           alt="Hero banner"
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-black bg-opacity-5" />
         <div className="absolute inset-0 flex items-center justify-center">
           <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-medium tracking-wider">
             SHOP ALL PRODUCTS
           </h1>
         </div>
       </div>
     </div>

     {/* Main content with max width */}
     <div className="max-w-[1400px] mx-auto px-6 mt-12">
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {currentPrints.map((print) => (
        <Link 
          to={`/products/${print._id}`} 
          key={print._id} 
          className="group"
        >
          <div className="space-y-4">
            <div className="relative"> {/* Added relative positioning */}
              <div 
                className="aspect-square bg-gray-100 rounded-3xl overflow-hidden group"
                onMouseEnter={() => setHoveredId(print._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <img 
                  src={hoveredId === print._id && print.additionalImages?.[0] 
                    ? print.additionalImages[0] 
                    : print.mainImage}
                  alt={print.name}
                  className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                />
              </div>
              {/* Favorite Button */}
              <button 
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation to product detail
                  if (!user) {
                    navigate('/login');
                  } else {
                    // Add to favorites logic here
                    toggleFavorite(print._id);
                  }
                }}
                className="absolute bottom-4 right-4 p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform"
              >
                <img 
                  src="/assets/profile-icon.svg"
                  alt="Favorite"
                  className="w-5 h-5"
                />
              </button>
            </div>
            <div className="space-y-1">
              <h2 className="text-gray-800">{print.name}</h2>
              <p className="text-gray-800">{print.price} kr</p>
            </div>
          </div>
        </Link>
      ))}
       </div>

       {/* Pagination */}
       <div className="flex justify-center items-center space-x-4 py-8">
         <button 
           onClick={() => paginate(currentPage - 1)}
           disabled={currentPage === 1}
           className="text-gray-500 hover:text-black disabled:opacity-50"
         >
           ←
         </button>

         {[...Array(totalPages)].map((_, index) => (
           <button
             key={index}
             onClick={() => paginate(index + 1)}
             className={`px-3 py-1 ${
               currentPage === index + 1 
                 ? 'border-b-2 border-black' 
                 : 'text-gray-500 hover:text-black'
             }`}
           >
             {index + 1}
           </button>
         ))}

         <button 
           onClick={() => paginate(currentPage + 1)}
           disabled={currentPage === totalPages}
           className="text-gray-500 hover:text-black disabled:opacity-50"
         >
           →
         </button>
       </div>
     </div>
   </>
 );
};

export default ProductListPage;