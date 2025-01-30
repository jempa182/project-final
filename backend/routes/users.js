// routes/users.js
import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

// GET /users/profile - Get user profile
router.get("/profile", authenticateUser, async (req, res) => {
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

// DELETE /users/:email - Delete user account
router.delete("/:email", async (req, res) => {
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

// You could add more user routes here like:
// - PUT /users/profile (update profile)
// - PUT /users/password (change password)
// - GET /users/orders (get user's order history)

export default router;