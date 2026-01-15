const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

/**
 * POST /feedback
 * Patient submits feedback
 */
router.post("/", async (req, res) => {
  try {
    const { patientId, doctorId, rating, comment } = req.body;

    if (!patientId || !doctorId || !rating) {
      return res.status(400).json({
        message: "Patient, doctor and rating are required",
      });
    }

    const feedback = await Feedback.create({
      patientId,
      doctorId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /feedback
 * View all feedbacks (admin/doctor later)
 */
router.get("/", async (req, res) => {
  const feedbacks = await Feedback.find()
    .populate("patientId", "name")
    .populate("doctorId", "name");

  res.json(feedbacks);
});

/**
 * GET /feedback/patient/:patientId
 * Get feedback submitted by a specific patient
 */
router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const feedbacks = await Feedback.find({ patientId })
      .populate("doctorId", "name")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch patient feedback" });
  }
});

// GET feedback for a specific doctor
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    const feedbacks = await Feedback.find({ doctorId })
      .populate("patientId", "name")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch doctor feedback" });
  }
});

module.exports = router;

