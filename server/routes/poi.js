const express = require("express");
const router = express.Router();
const {
  createPoi,
  getAllPois,
  getPoiById,
  getPoisByUserId,
  updatePoi,
  deletePoi,
} = require("../controllers/poiController");
const { authenticateToken, verifyPrivileges } = require("../middlewares/auth");

// Create a new POI
router.post("/", authenticateToken, createPoi);

// Get all POIs
router.get("/", getAllPois);

// Get a single POI by ID
router.get("/:id", getPoiById);

// Get all POIs by user ID
router.get("/user/:userId", getPoisByUserId);

// Update a POI
router.put("/:id", authenticateToken, updatePoi);

// Delete a POI
router.delete("/:id", authenticateToken, verifyPrivileges, deletePoi);

module.exports = router;
