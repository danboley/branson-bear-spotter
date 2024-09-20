require("dotenv").config();
const express = require("express");
const cors = require("cors");
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
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'Healthy' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
