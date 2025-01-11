import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Print } from './models/Print';
import { User } from './models/User';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

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

// POST route
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
      { new: true } // This option returns the updated document
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

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});