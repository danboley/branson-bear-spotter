const { Poi, User } = require("../models");

// Create a new POI
const createPoi = async (req, res) => {
  try {
    const newPoi = await Poi.create(req.body);
    res.status(201).json(newPoi);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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

// Update a POI
const updatePoi = async (req, res) => {
  try {
    const [updated] = await Poi.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: "POI not found" });
    }
    const updatedPoi = await Poi.findByPk(req.params.id, { include: User });
    res.status(200).json(updatedPoi);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
  updatePoi,
  deletePoi,
};
