const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");
const { isAuthenticated, isDriver } = require("../middleware/auth");
router.get("/g2", isAuthenticated, isDriver, driverController.getG2Page);
router.post(
  "/g2/store",
  isAuthenticated,
  isDriver,
  driverController.postG2Page
);
router.get("/g", isAuthenticated, isDriver, driverController.getGPage);
router.post(
  "/g/update",
  isAuthenticated,
  isDriver,
  driverController.updateGPage
);
router.get(
  "/appointments",
  isAuthenticated,
  isDriver,
  driverController.getAvailableAppointments
);

router.post(
  "/book-appointment",
  isAuthenticated,
  isDriver,
  driverController.bookAppointment
);

module.exports = router;
