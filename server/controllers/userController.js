const { User, Poi } = require("../models");
const bcrypt = require("bcryptjs");
const { upload, uploadImageToGCS } = require("../middlewares/imageUploads");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

// Helper function to delete old image
const deleteFromGCS = (imagePath) => {
  const fileName = imagePath.split("/").pop();
  const file = bucket.file(fileName);

  return file.delete().catch((err) => {
    console.error("Failed to delete file from Google Cloud Storage", err);
  });
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

      let imagePath = user.imagePath;

      if (req.file) {
        if (user.imagePath) {
          await deleteFromGCS(user.imagePath);
        }
        imagePath = await uploadImageToGCS(req.file);
      }

      const updatedData = { ...req.body, imagePath };

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

    if (user.imagePath) {
      await deleteFromGCS(user.imagePath);
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

const updatePassword = async (req, res) => {
  const { existingPassword, newPassword } = req.body;

  if (!existingPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Both existing and new passwords are required" });
  }

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      existingPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid existing password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedNewPassword },
      { where: { id: user.id } }
    );

    res.status(200).json({ message: "Password updated successfully" });
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
  updatePassword,
};
