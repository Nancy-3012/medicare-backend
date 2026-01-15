const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

// BOOK APPOINTMENT
router.post("/", async (req, res) => {
  try {
    const { patientId, doctorId, date, time } = req.body;

    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({
        message: "All appointment fields are required",
      });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      time,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET MY APPOINTMENTS (patient-wise)
router.get("/", async (req, res) => {
  try {
    const { patientId } = req.query;

    // If patientId is provided → filter
    const filter = patientId ? { patientId } : {};

    const appointments = await Appointment.find(filter)
      .populate("patientId")
      .populate("doctorId");

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET doctor queue (today)
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    const today = new Date().toISOString().split("T")[0];

    const appointments = await Appointment.find({
      doctorId,
      date: { $gte: today },
      status: { $nin: ["Cancelled", "Checked"] }
    })
      .populate("patientId", "name")
      .sort({ createdAt: 1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch queue" });
  }
});


// UPDATE appointment status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});

module.exports = router;

