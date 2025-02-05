import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Heart } from 'lucide-react';

const ProductListPage = () => {
  // --- URL and Navigation Setup ---
  const { category } = useParams();
  const navigate = useNavigate();

  // --- State Management ---
  // Products and loading state
  const [prints, setPrints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // -Category and filtering-
  // useState hook to manage which category is currently selected
  const [selectedCategory, setSelectedCategory] = useState(category || 'All products');
  
  // Array of all possible categories
  const categories = ['All products', 'Art Prints', 'T-shirts', 'Accessories', 'Stickers'];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // UI interaction states. When no product is hovered = null
  const [hoveredId, setHoveredId] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const printsPerPage = 16;
  
  // User-related state
  const { user } = useUser();

  // --- Favorites Management ---
  const [favorites, setFavorites] = useState([]); // Store IDs of favorited products

  // --- Data Fetching ---
  // Fetch all products
  useEffect(() => {
    const fetchPrints = async () => {
      try {
        const response = await fetch('https://jenny-a-artwork.onrender.com/prints');
        const data = await response.json();
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

  // Fetch Favorites - Fetches user's favorites if logged in
  // This effect runs whenever the user state changes
  useEffect(() => {
    const fetchFavorites = async () => {
      // Only attempt to fetch favorites if we have a logged-in user
      if (user) {
        try {
          const response = await fetch('https://jenny-a-artwork.onrender.com/favorites', {
            headers: {
              // Include auth token for protected route access
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          if (data.success) {
            // Extract just the IDs from the favorites for easy comparison
            setFavorites(data.favorites.map(fav => fav._id));
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };
    fetchFavorites();
  }, [user]);

  // Function to toggle products as favorites
  const toggleFavorite = async (printId) => {
    try {
      const response = await fetch(`https://jenny-a-artwork.onrender.com/favorites/${printId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.ok) {
         // State update: if product is in favorites, remove it; if not, add it
        setFavorites((prevFavorites) =>
          prevFavorites.includes(printId)
            ? prevFavorites.filter((id) => id !== printId) // Remove from favorites
            : [...prevFavorites, printId]                  // Add to favorites
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // --- Filtering and Pagination Logic ---
  // Filter products based on selected category
  const filteredPrints = selectedCategory === 'All products' 
    ? prints 
    : prints.filter(print => print.category === selectedCategory);

  // Calculate pagination values
  const indexOfLastPrint = currentPage * printsPerPage;
  const indexOfFirstPrint = indexOfLastPrint - printsPerPage;
  const currentPrints = filteredPrints.slice(indexOfFirstPrint, indexOfLastPrint);
  const totalPages = Math.ceil(filteredPrints.length / printsPerPage);

  // Pagination handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- Loading and Empty States ---
  if (isLoading) {
    return <div>Loading prints...</div>;
  }

  if (prints.length === 0) {
    return <div>No prints available yet</div>;
  }

  // --- UI ---
  return (
    <>
      {/* Hero Banner Section */}
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
              SHOP
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Section - This wraps all our product display stuff */}
      <div className="max-w-[1400px] mx-auto px-2 mt-12">
        {/* Category Dropdown - filter system */}
        <div className="relative mb-8">
          {/* Main dropdown button - Shows currently selected category */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="border border-green-800 text-green-900 px-4 py-2 rounded-lg text-sm w-full text-left"
          >
            {selectedCategory}
          </button>
          {/* Dropdown menu - Only shows when dropdownOpen is true */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-[#FFF9F0] border border-green-800 rounded-lg shadow-md z-10">
              {/* Maps through categories array */}
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category); // Update the filter
                    setDropdownOpen(false);        // Close the dropdown after selection
                  }}
                  className="block w-full text-left px-4 py-2 text-green-900 hover:bg-green-100"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid - Responsive layout with hover effects */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {currentPrints.map((print) => (
            <Link to={`/products/${print._id}`} key={print._id} className="group">
              <div className="space-y-4">
                <div className="relative">
                  {/* Product image container with hover detection */}
                  <div
                    className="aspect-square bg-gray-100 rounded-3xl overflow-hidden group"
                    onMouseEnter={() => setHoveredId(print._id)} // Store this product's ID when mouse enters
                    onMouseLeave={() => setHoveredId(null)}     // Clear the ID when mouse leaves
                  >
                    <img
                      // Smart image source selection:
                      src={hoveredId === print._id && print.additionalImages?.[0] 
                        ? print.additionalImages[0] 
                        : print.mainImage}
                      alt={print.name}
                      // Classes for smooth transitions and hover effects:
                      className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                    />
                  </div>
                  {/* Favorite Button - Heart icon that toggles favorite status */}
                  <button
                    onClick={(e) => {
                      e.preventDefault(); 
                      if (!user) {
                        navigate('/login'); // Redirect to login if no user
                      } else {
                        toggleFavorite(print._id); // Toggle favorite status if logged in
                      }
                    }}
                    className="absolute bottom-4 right-4 p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform"
                  >
                    {/* Filled/outlined heart based on favorite status */}
                    {favorites.includes(print._id) ? (
                      <Heart className="w-5 h-5 fill-red-500 stroke-red-500" />
                    ) : (
                      <Heart className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {/* Product info */}
                <div className="space-y-1">
                  <h2 className="text-gray-800">{print.name}</h2>
                  <p className="text-gray-800">{print.price} kr</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls - navigating through product pages */}
        <div className="flex justify-center items-center space-x-4 py-8">
          {/* Previous page button - Disabled if we're on page 1 */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-gray-500 hover:text-black disabled:opacity-50"
          >
            ←
          </button>

          {/* Page number buttons, creates an array of numbers based on total pages */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              /* Styling: Underlined if current page, gray if not */
              className={`px-3 py-1 ${
                currentPage === index + 1 
                  ? 'border-b-2 border-black' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {index + 1}
            </button>
          ))}

          {/* Next page button - Disabled if we're on the last page */}
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