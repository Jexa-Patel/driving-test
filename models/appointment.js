const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  driverName: String,
  testType: { type: String, enum: ["G", "G2"] },
  time: { type: String, required: true },
  comment: String,
  pass: Boolean,
  isTimeSlotAvailable: { type: Boolean, default: true },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;


