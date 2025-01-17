// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Print } from './models/Print';
import { User } from './models/User';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Authentication Routes
app.post("/signup", async (req, res) => {
 try {
   const { firstName, lastName, email, password } = req.body;
   
   const existingUser = await User.findOne({ email });
   if (existingUser) {
     return res.status(400).json({
       success: false,
       message: "Email already registered"
     });
   }

   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);

   const user = await User.create({
     firstName,
     lastName,
     email,
     password: hashedPassword
   });

   const token = jwt.sign(
     { userId: user._id }, 
     'your-secret-key',
     { expiresIn: '24h' }
   );

   res.json({
     success: true,
     token,
     user: {
       id: user._id,
       firstName: user.firstName,
       lastName: user.lastName,
       email: user.email
     }
   });
 } catch (error) {
   res.status(400).json({
     success: false,
     error: error.message
   });
 }
});

app.post("/login", async (req, res) => {
 try {
   const { email, password } = req.body;

   const user = await User.findOne({ email });
   if (!user) {
     return res.status(400).json({
       success: false,
       message: "User not found"
     });
   }

   const validPassword = await bcrypt.compare(password, user.password);
   if (!validPassword) {
     return res.status(400).json({
       success: false,
       message: "Invalid password"
     });
   }

   const token = jwt.sign(
     { userId: user._id },
     'your-secret-key',
     { expiresIn: '24h' }
   );

   res.json({
     success: true,
     token,
     user: {
       id: user._id,
       firstName: user.firstName,
       lastName: user.lastName,
       email: user.email
     }
   });
 } catch (error) {
   res.status(400).json({
     success: false,
     error: error.message
   });
 }
});

// Middleware to protect routes
const authenticateUser = async (req, res, next) => {
 try {
   const token = req.header('Authorization')?.replace('Bearer ', '');
   if (!token) {
     throw new Error();
   }

   const decoded = jwt.verify(token, 'your-secret-key');
   const user = await User.findById(decoded.userId);
   
   if (!user) {
     throw new Error();
   }

   req.user = user;
   next();
 } catch (error) {
   res.status(401).json({
     success: false,
     message: "Please authenticate"
   });
 }
};

// Test route to get all prints 
app.get("/prints", async (req, res) => {
 try {
   const prints = await Print.find();
   res.json({
     success: true,
     prints
   });
 } catch (error) {
   res.status(400).json({
     success: false,
     error: error.message
   });
 }
});

// Route to get a single print by ID
app.get("/prints/:id", async (req, res) => {
 try {
   const print = await Print.findById(req.params.id);
   if (!print) {
     return res.status(404).json({
       success: false,
       message: 'Print not found'
     });
   }
   res.json({
     success: true,
     print
   });
 } catch (error) {
   res.status(400).json({
     success: false,
     error: error.message
   });
 }
});

// POST route for prints
app.post("/prints", async (req, res) => {
 try {
   const { name, price, description, imageUrl } = req.body;
   const newPrint = await Print.create({
     name,
     price,
     description,
     imageUrl
   });
   res.json({
     success: true,
     print: newPrint
   });
 } catch (error) {
   res.status(400).json({
     success: false,
     error: error.message
   });
 }
});

// Route to update a print
app.put("/prints/:id", async (req, res) => {
 try {
   const { id } = req.params;
   const { name, price, description, imageUrl } = req.body;
   
   const updatedPrint = await Print.findByIdAndUpdate(
     id,
     { name, price, description, imageUrl },
     { new: true }
   );
   
   if (!updatedPrint) {
     return res.status(404).json({
       success: false,
       message: "Print not found"
     });
   }
   
   res.json({
     success: true,
     print: updatedPrint
   });
 } catch (error) {
   res.status(400).json({
     success: false,
     error: error.message
   });
 }
});

// Route to delete a print
app.delete("/prints/:id", async (req, res) => {
 try {
   const { id } = req.params;
   const deletedPrint = await Print.findByIdAndDelete(id);
   
   if (!deletedPrint) {
     return res.status(404).json({
       success: false,
       message: "Print not found"
     });
   }
   
   res.json({
     success: true,
     message: "Print successfully deleted"
   });
 } catch (error) {
   res.status(400).json({
     success: false,
     error: error.message
   });
 }
});

// Protected route example
app.get("/user/profile", authenticateUser, async (req, res) => {
 res.json({
   success: true,
   user: {
     id: req.user._id,
     firstName: req.user.firstName,
     lastName: req.user.lastName,
     email: req.user.email
   }
 });
});

// Delete user
app.delete("/users/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const deletedUser = await User.findOneAndDelete({ email });
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      message: "User successfully deleted"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.get("/", (req, res) => {
 res.send("Hello Technigo!");
});

app.listen(port, () => {
 console.log(`Server running on http://localhost:${port}`);
});