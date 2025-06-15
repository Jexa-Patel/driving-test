const User = require("../models/user");
const Appointment = require("../models/appointment");
exports.getG2Page = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    console.log(user);

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("g2_lic", { user: user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("An error occurred while fetching user data");
  }
};

exports.postG2Page = async (req, res) => {
  const {
    firstname,
    lastname,
    licenseno,
    age,
    dob,
    make,
    model,
    year,
    platno,
  } = req.body;

  // Validation
  const errors = [];
  if (
    !firstname ||
    !lastname ||
    !licenseno ||
    !age ||
    !dob ||
    !make ||
    !model ||
    !year ||
    !platno
  ) {
    errors.push("All fields are required.");
  }

  if (licenseno.length !== 8) {
    errors.push("License number must be exactly 8 characters long.");
  }

  if (errors.length > 0) {
    return res.render("g2_lic", {
      user: req.body,
      errors: errors,
    });
  }

  try {
    await User.findByIdAndUpdate(
      req.session.user.id,
      {
        firstname,
        lastname,
        licenseno,
        age,
        dob,
        car_details: { make, model, year, platno },
        hasCompletedG2: true,
      },
      { new: true }
    );

    // res.redirect("/g2");
    res
      .status(200)
      .send(
        `<script>alert('Data updated successfully!'); window.location='/g2';</script>`
      );
  } catch (error) {
    console.error("Error updating G2 information:", error);
    res.status(500).send("An error occurred while updating G2 information");
  }
};

exports.getGPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate(
      "appointmentId"
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if user has completed G2 information
    if (!user.hasCompletedG2) {
      return res.redirect("/g2");
    }
    const appointment = user.appointmentId;
    console.log(appointment);

    res.render("g_lic", { user, appointment });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("An error occurred while fetching user data");
  }
};
exports.updateGPage = async (req, res) => {
  try {
    const { make, model, year, platno } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user.id,
      {
        "car_details.make": make,
        "car_details.model": model,
        "car_details.year": year,
        "car_details.platno": platno,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    // res.redirect("/g");
    res
      .status(200)
      .send(
        `<script>alert('Data updated successfully!'); window.location='/g';</script>`
      );
  } catch (error) {
    console.error("Error updating car details:", error);
    res.status(500).send("An error occurred while updating car details");
  }
};
exports.getAvailableAppointments = async (req, res) => {
  const { date } = req.query;

  try {
    const availableAppointments = await Appointment.find({
      date,
      isTimeSlotAvailable: true,
    });
    res.json(availableAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
};
exports.bookAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  const userId = req.session.user.id;

  try {
    const user = await User.findById(userId);
    if (user.appointmentId) {
      return res.status(400).json({
        success: false,
        message: "You already have a booked appointment.",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { isTimeSlotAvailable: false },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment slot not found" });
    }

    user.appointmentId = appointmentId;
    if (req.body.buttonValue === "g") {
      user.testType = "g";
      user.examinerComment = null;
      user.testResult = null;
    } else {
      user.testType = "g2";
      user.examinerComment = null;
      user.testResult = null;
    }
    await user.save();

    res.json({ success: true, message: "Appointment booked successfully." });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res
      .status(500)
      .json({ success: false, message: "Error booking appointment." });
  }
};
