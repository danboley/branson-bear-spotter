const { User, Poi } = require("../models");
const upload = require("../middlewares/imageUploads");
const path = require("path");
const fs = require("fs");

// Helper function to delete old image
const deleteOldImage = (imagePath) => {
  if (imagePath) {
    const oldImagePath = path.join(__dirname, "..", imagePath);
    fs.unlink(oldImagePath, (err) => {
      if (err) console.error("Error deleting old file:", err);
    });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
const updateUser = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedData = { ...req.body };

      if (req.file) {
        deleteOldImage(user.imagePath);
        updatedData.imagePath = `/uploads/${req.file.filename}`;
      } else if (req.body.existingImagePath) {
        updatedData.imagePath = req.body.existingImagePath;
      }

      await User.update(updatedData, {
        where: { id: req.params.id },
      });

      const updatedUser = await User.findByPk(req.params.id);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update associated POIs to have NULL userId
    await Poi.update({ userId: null }, { where: { userId } });

    // Delete the user
    await User.destroy({
      where: { id: userId },
    });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
