const express = require("express");
const Appointment = require("../models/Appointment");
const Feedback = require("../models/Feedback");

const router = express.Router();

/**
 * GET patient dashboard stats
 * /dashboard/patient/:patientId
 */
router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // TOTAL APPOINTMENTS
    const totalAppointments = await Appointment.countDocuments({ patientId });

    // UPCOMING APPOINTMENTS (today onwards)
    const today = new Date().toISOString().split("T")[0];
    const upcomingAppointments = await Appointment.countDocuments({
      patientId,
      date: { $gte: today },
    });

    // FEEDBACK COUNT
    const feedbackCount = await Feedback.countDocuments({ patientId });

    // RECENT APPOINTMENTS (last 3)
    const recentAppointments = await Appointment.find({ patientId })
      .populate("doctorId", "name")
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      totalAppointments,
      upcomingAppointments,
      feedbackCount,
      recentAppointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
});

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    // 🔥 DO NOT FILTER BY DATE
    const appointments = await Appointment.find({
      doctorId,
      status: { $ne: "Cancelled" },
    }).populate("patientId", "name");

    const todayAppointments = appointments.length;

    const todayQueueCount = appointments.filter(
      (a) => a.status !== "Checked"
    ).length;

    res.json({
      todayAppointments,
      todayQueueCount,
      recentAppointments: appointments.slice(0, 5),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Doctor dashboard failed" });
  }
});




module.exports = router;
