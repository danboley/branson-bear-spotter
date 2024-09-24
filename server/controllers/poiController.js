const { Poi, User } = require("../models");
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

// Create a new POI
const createPoi = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      let imagePath = null;
      if (req.file) {
        imagePath = await uploadImageToGCS(req.file);
      }
      const newPoi = await Poi.create({
        ...req.body,
        imagePath,
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
      include: User,
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

      let imagePath = poi.imagePath;

      if (req.file) {
        if (poi.imagePath) {
          await deleteFromGCS(poi.imagePath);
        }
        imagePath = await uploadImageToGCS(req.file);
      }

      const updatedData = { ...req.body, imagePath };

      if (updatedData.userId === "null") {
        updatedData.userId = null;
      }

      await Poi.update(updatedData, {
        where: { id: req.params.id },
      });

      const updatedPoi = await Poi.findByPk(req.params.id);
      res.status(200).json(updatedPoi);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// Delete a POI
const deletePoi = async (req, res) => {
  try {
    const poi = await Poi.findByPk(req.params.id);
    if (!poi) {
      return res.status(404).json({ error: "POI not found" });
    }

    if (poi.imagePath) {
      await deleteFromGCS(poi.imagePath);
    }

    await Poi.destroy({
      where: { id: req.params.id },
    });

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
