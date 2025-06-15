const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ["Driver", "Examiner", "Admin"],
    required: true,
  },
  firstname: { type: String, default: "default" },
  lastname: { type: String, default: "default" },
  licenseno: { type: String, default: "default" },
  age: { type: Number, default: 0 },
  dob: { type: Date, default: null },

  testType: { type: String, enum: ["G", "G2"], default: null },
  comment: { type: String, default: null },
  passFail: { type: Boolean, default: null },

  car_details: {
    make: { type: String, default: "default" },
    model: { type: String, default: "default" },
    year: { type: Number, default: 0 },
    platno: { type: String, default: "default" },
  },
  hasCompletedG2: { type: Boolean, default: false },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    default: null,
  },
  testType: { type: String, enum: ["g2", "g"] },
  examinerComment: { type: String, default: "" },
  testResult: { type: Boolean, default: null },
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
