const express = require("express");
const User = require("../models/User");

const router = express.Router();

/**
 * GET all doctors
 * /doctors
 */
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "_id name email"
    );

    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

module.exports = router;
