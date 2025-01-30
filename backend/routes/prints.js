// routes/prints.js
import express from 'express';
import { Print } from '../models/Print.js';

// Create a router instance instead of using app directly
const router = express.Router();

// GET /prints - Get all prints
router.get("/", async (req, res) => {
  try {
    const prints = await Print.find().lean();
    // Added debug log to track performance
    console.log('Prints found:', prints.length);
    res.json({
      success: true,
      prints
    });
  } catch (error) {
    console.error('Error fetching prints:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /prints/:id - Get single print
router.get("/:id", async (req, res) => {
  try {
    const print = await Print.findById(req.params.id).select('+category');
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

// POST /prints - Create new print
router.post("/", async (req, res) => {
  try {
    const { name, price, description, imageUrl, category } = req.body;
    const newPrint = await Print.create({
      name,
      price,
      description,
      imageUrl,
      category
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

// PUT /prints/:id - Update print
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, imageUrl, category } = req.body;
    
    const updatedPrint = await Print.findByIdAndUpdate(
      id,
      { name, price, description, imageUrl, category },
      { new: true }
    ).select('+category');
    
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

// DELETE /prints/:id - Delete print
router.delete("/:id", async (req, res) => {
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

// Export the router for use in server.js
export default router;