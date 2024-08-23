require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/user");
const poiRoutes = require("./routes/poi");
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pois", poiRoutes);

app.listen(5005, () => {
  console.log("Server started on port 5005");
});
