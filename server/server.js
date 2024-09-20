require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
const userRoutes = require("./routes/user");
const poiRoutes = require("./routes/poi");
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pois", poiRoutes);

const PORT = process.env.PORT || 5005;

// Health Check Route
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "Healthy" });
});

// Check database connection
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
