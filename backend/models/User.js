// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Print'
  }],
  cart: [{
    print: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Print'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }]
});

export const User = mongoose.model('User', UserSchema);