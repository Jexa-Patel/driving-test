const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const authRoutes = require("./routes/auth");
const driverRoutes = require("./routes/driver");
const adminRoutes = require("./routes/admin");
const { isAuthenticated } = require("./middleware/auth");
const examinerRoutes = require("./routes/examiner");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "mySuperSecretKey1234567890",
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

mongoose
  .connect(
    "mongodb+srv://bhumzz:Bhumzz123@assignment.i9lsk.mongodb.net/licence_booking"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection failed", err));

// Public routes
app.get("/login", (req, res) =>
  res.render("login", { error: null, showSignupLink: false })
);
app.get("/signup", (req, res) => res.render("signup"));
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});
// Auth routes
app.use("/", authRoutes);

// Protected routes
app.use("/", isAuthenticated, driverRoutes);
app.use("/", isAuthenticated, adminRoutes);
app.use("/", isAuthenticated, examinerRoutes);

// Root route
app.get("/", isAuthenticated, (req, res) => {
  res.render("index", { user: req.session.user });
});
app.get("/g", isAuthenticated, (req, res) => {
  res.render("g_lic", { user: req.session.user });
});
// Examiner-specific routes
app.use(
  "/examiner",
  isAuthenticated,
  (req, res, next) => {
    if (req.session.user?.userType === "Examiner") {
      next();
    } else {
      res.status(403).send("Access Denied");
    }
  },
  examinerRoutes
);

// Admin-specific routes
app.use(
  "/admin",
  isAuthenticated,
  (req, res, next) => {
    if (req.session.user?.userType === "Admin") {
      next();
    } else {
      res.status(403).send("Access Denied");
    }
  },
  adminRoutes
);

app.listen(4000, () => console.log("App listening on port 4000"));
