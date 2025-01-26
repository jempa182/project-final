// models/Print.js
import mongoose from "mongoose";

const PrintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mainImage: {
    type: String,
    required: true
  },
  additionalImages: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    default: 1
  }
});

export const Print = mongoose.model('Print', PrintSchema);