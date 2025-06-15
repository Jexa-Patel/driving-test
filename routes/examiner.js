const express = require("express");
const User = require("../models/user");
const { isAuthenticated, isExaminer } = require("../middleware/auth");

const router = express.Router();

// Get all appointments for the examiner
router.get("/examiner", isAuthenticated, isExaminer, async (req, res) => {
  try {
    const validTestTypes = ["g", "g2"]; // Allowable test types
    const { testType } = req.query;

    // Build query to filter dynamically, restricting only to valid test types
    const query =
      testType && validTestTypes.includes(testType)
        ? { testType }
        : { testType: { $in: validTestTypes } };

    // Fetch users based on the query
    const users = await User.find(query).select(
      "firstname lastname car_details testType"
    );

    // Render the results in the examiner view
    res.render("examiner", { users });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Error fetching data.");
  }
});

// Get driver details
router.get("/examiner/driver/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "firstname lastname car_details testType examinerComment testResult"
    );
    res.render("driverDetails", { user });
  } catch (err) {
    res.status(500).send("Error fetching driver details.");
  }
});

// Update test result and comment
router.post("/examiner/driver/:id", async (req, res) => {
  try {
    const { examinerComment, testResult } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      examinerComment,
      testResult: testResult === "pass",
      appointmentId: null,
    });
    // res.redirect("/examiner");
    res
      .status(200)
      .send(
        `<script>alert('Data updated successfully!'); window.location='/examiner';</script>`
      );
  } catch (err) {
    res.status(500).send("Error updating test result.");
  }
});

module.exports = router;
