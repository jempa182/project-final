// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
 return (
   <footer className="bg-[#34483B] text-[#FBACFD] py-20">
     <div className="max-w-[1100px] mx-auto px-6">
       <div className="flex flex-col items-center md:grid md:grid-cols-3 gap-8">
         {/* Left Column */}
         <div className="flex flex-row justify-start space-x-6 order-2 md:order-1 font-custom">
           <Link to="/" className="hover:opacity-80">HOME</Link>
           <Link to="/about" className="hover:opacity-80">ABOUT</Link>
           <Link to="/contact" className="hover:opacity-80">CONTACT</Link>
         </div>

         {/* Center Column */}
         <div className="flex flex-col items-center space-y-4 order-1 md:order-2 font-custom">
           <img 
             src="/assets/jenny-logo-white.gif" 
             alt="Logo" 
             className="h-14 w-auto"
           />
           <div className="w-12 h-0.5 bg-[#FBACFD]" />
           <p>Follow me on social media</p>
           <div className="flex space-x-4">
             <a 
               href="https://www.instagram.com/jennyandpen/"
               target="_blank"
               rel="noopener noreferrer"
               className="hover:opacity-80"
             >
               <img 
                 src="/assets/Btn-instagram.svg" 
                 alt="Instagram" 
                 className="h-6 w-6"
               />
             </a>
             <a 
               href="https://www.linkedin.com/in/jennyandersen1/"
               target="_blank"
               rel="noopener noreferrer"
               className="hover:opacity-80"
             >
               <img 
                 src="/assets/Btn-linkedin.svg" 
                 alt="LinkedIn" 
                 className="h-6 w-6"
               />
             </a>
           </div>
         </div>

         {/* Right Column */}
         <div className="flex flex-row justify-end space-x-6 order-3 font-custom">
      
         </div>
       </div>
     </div>
   </footer>
 );
};

export default Footer;