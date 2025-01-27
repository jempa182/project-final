// pages/AboutPage.jsx
import React from 'react';

const AboutPage = () => {
 return (
   <div className="max-w-[1000px] mx-auto px-6 py-12">
     {/* Image Section */}
     <div className="flex justify-center mb-24">
       <img 
         src="https://images.pexels.com/photos/1831234/pexels-photo-1831234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
         alt="Profile"
         className="w-64 h-64 object-cover rounded-full"
       />
     </div>

     {/* Content Grid */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
       {/* Column 1 */}
       <div>
         <h1 className="text-3xl font-bold mb-4">About me</h1>
       </div>

       {/* Column 2 */}
       <div>
         <p className="text-gray-700">
           Your first paragraph of text here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
           Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
         </p>
       </div>

       {/* Column 3 */}
       <div>
         <p className="text-gray-700">
           Your second paragraph of text here. Ut enim ad minim veniam, quis nostrud exercitation 
           ullamco laboris nisi ut aliquip ex ea commodo consequat.
         </p>
       </div>
     </div>
   </div>
 );
};

export default AboutPage;