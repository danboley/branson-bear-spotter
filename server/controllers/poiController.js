const path = require("path");
const fs = require("fs");
const { Poi, User } = require("../models");
const upload = require("../middlewares/imageUploads");

// Helper function to delete old image
const deleteOldImage = (imagePath) => {
  if (imagePath) {
    const oldImagePath = path.join(__dirname, "..", imagePath);
    fs.unlink(oldImagePath, (err) => {
      if (err) console.error("Error deleting old file:", err);
    });
  }
};

// Create a new POI
const createPoi = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const newPoi = await Poi.create({
        ...req.body,
        imagePath: req.file ? `/uploads/${req.file.filename}` : null,
      });
      res.status(201).json(newPoi);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// Get all POIs
const getAllPois = async (req, res) => {
  try {
    const pois = await Poi.findAll({ include: User });
    if (pois.length === 0) {
      return res.status(200).json({ message: "No POIs found" });
    }
    res.status(200).json(pois);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single POI by ID
const getPoiById = async (req, res) => {
  try {
    const poi = await Poi.findByPk(req.params.id, { include: User });
    if (!poi) {
      return res.status(404).json({ error: "POI not found" });
    }
    res.status(200).json(poi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all POIs for a specific user
const getPoisByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const pois = await Poi.findAll({
      where: { userId },
      include: User
    });
    if (pois.length === 0) {
      return res.status(404).json({ error: "No POIs found for this user" });
    }
    res.status(200).json(pois);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a POI
const updatePoi = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const poi = await Poi.findByPk(req.params.id);
      if (!poi) {
        return res.status(404).json({ error: "POI not found" });
      }

      const updatedData = { ...req.body };

      if (req.file) {
        deleteOldImage(poi.imagePath);
        updatedData.imagePath = `/uploads/${req.file.filename}`;
      } else if (req.body.existingImagePath) {
        updatedData.imagePath = req.body.existingImagePath;
      }

      if (updatedData.userId === "null") {
        updatedData.userId = null;
      }

      await Poi.update(updatedData, {
        where: { id: req.params.id },
      });

      const updatedPoi = await Poi.findByPk(req.params.id);
      res.status(200).json(updatedPoi);
    } catch (error) {
      console.error("Update error:", error);
      res.status(400).json({ error: error.message });
    }
  });
};

// Delete a POI
const deletePoi = async (req, res) => {
  try {
    const deleted = await Poi.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "POI not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPoi,
  getAllPois,
  getPoiById,
  getPoisByUserId,
  updatePoi,
  deletePoi,
};
