const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
} = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/auth");

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getAllUsers);

// Get a single user by ID
router.get("/:id", getUserById);

// Update a user
router.put("/:id", updateUser);

// Delete a user
router.delete("/:id", deleteUser);

// Update password
router.put("/:id/password", authenticateToken, updatePassword);

module.exports = router;
