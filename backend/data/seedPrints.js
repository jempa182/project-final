// backend/data/seedPrints.js
import mongoose from 'mongoose';
import { Print } from '../models/Print.js';

const prints = [
  {
    name: "Print 1 - Name",
    price: 253,
    description: "Hello! This is a description about the print.",
    mainImage: "/assets/print-example-image.jpeg",
    additionalImages: [
      "/assets/print-example-image2.jpeg",
      "/assets/print-example-image.jpeg",
      "/assets/print-example-image.jpeg"
    ]
  },
  {
    name: "Print 2 - Name",
    price: 253,
    description: "This is a description about the print.",
    mainImage: "/assets/print-example-image.jpeg",
    additionalImages: [
      "/assets/print-example-image2.jpeg",
      "/assets/print-example-image.jpeg",
      "/assets/print-example-image.jpeg"
    ]
  },
  {
    name: "Print 3 - Name",
    price: 253,
    description: "This is a description about the print.",
    mainImage: "/assets/print-example-image.jpeg",
    additionalImages: [
      "/assets/print-example-image2.jpeg",
      "/assets/print-example-image.jpeg",
      "/assets/print-example-image.jpeg"
    ]
  },
  {
    name: "Print 4 - Name",
    price: 253,
    description: "This is a description about the print.",
    mainImage: "/assets/print-example-image.jpeg",
    additionalImages: [
      "/assets/print-example-image2.jpeg",
      "/assets/print-example-image.jpeg",
      "/assets/print-example-image.jpeg"
    ]
  },
  {
    name: "Print 5 - Name",
    price: 253,
    description: "This is a description about the print.",
    mainImage: "/assets/print-example-image.jpeg",
    additionalImages: [
      "/assets/print-example-image2.jpeg",
      "/assets/print-example-image.jpeg",
      "/assets/print-example-image.jpeg"
    ]
  }
  // Add more prints here
];

// Connect to MongoDB
mongoose.connect('mongodb://localhost/final-project')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing prints
      await Print.deleteMany({});
      console.log('Cleared existing prints');

      // Add new prints
      await Print.insertMany(prints);
      console.log('Added new prints');

      // Disconnect when done
      mongoose.disconnect();
    } catch (error) {
      console.error('Error seeding data:', error);
      mongoose.disconnect();
    }
  });