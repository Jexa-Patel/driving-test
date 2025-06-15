const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const driverController = require("../controllers/driverController");
const User = require("../models/user");

router.get(
  "/appointment",
  isAuthenticated,
  isAdmin,
  adminController.getAppointmentPage
);

router.post(
  "/appointment/add",
  isAuthenticated,
  isAdmin,
  adminController.addAppointmentSlot
);
router.get(
  "/appointment/availableSlots",
  isAuthenticated,
  adminController.getAvailableSlots
);
router.post("/appointment/book/:slotId", driverController.bookAppointment);
// Route to list pass/fail candidates
router.get("/candidates", isAdmin, async (req, res) => {
  try {
    const candidates = await User.find({ testResult: { $ne: null } }); // Fetch users with test results
    console.log(candidates);

    res.render("candidates", { candidates });
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
