const express = require("express");
const router = express.Router();
const {
  createPoi,
  getAllPois,
  getPoiById,
  updatePoi,
  deletePoi,
} = require("../controllers/poiController");

// Create a new POI
router.post("/", createPoi);

// Get all POIs
router.get("/", getAllPois);

// Get a single POI by ID
router.get("/:id", getPoiById);

// Update a POI
router.put("/:id", updatePoi);

// Delete a POI
router.delete("/:id", deletePoi);

module.exports = router;
