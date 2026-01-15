const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
require("dotenv").config();

const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// connect to MongoDB
connectDB();

// routes
app.use("/patients", patientRoutes);
app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/doctors", doctorRoutes);



app.get("/", (req, res) => {
  res.send("Hospital Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

