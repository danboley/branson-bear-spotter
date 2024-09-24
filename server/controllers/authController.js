const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { upload, uploadImageToGCS } = require("../middlewares/imageUploads");

const register = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        isAdmin,
        location,
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      if (req.file) {
        imagePath = await uploadImageToGCS(req.file);
      }

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        isAdmin,
        location,
        imagePath,
      });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};
