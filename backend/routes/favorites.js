// routes/favorites.js
import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

// POST /favorites/:printId - Toggle favorite status for a print
router.post("/:printId", authenticateUser, async (req, res) => {
  try {
    const { printId } = req.params;
    const user = req.user;

    // Toggle favorite status - remove if exists, add if doesn't
    if (user.favorites.includes(printId)) {
      user.favorites = user.favorites.filter(id => id.toString() !== printId);
    } else {
      user.favorites.push(printId);
    }

    await user.save();

    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /favorites - Get user's favorite prints
router.get("/", authenticateUser, async (req, res) => {
  try {
    // Populate favorites to get full print details
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;