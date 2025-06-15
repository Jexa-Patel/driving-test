const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  const { username, password, repeatPassword, userType } = req.body;

  if (password !== repeatPassword) {
    return res
      .status(400)
      .render("signup", { error: "Passwords do not match" });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .render("signup", { error: "Username already exists" });
    }

    const user = new User({ username, password, userType });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Error creating user");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", {
        error:
          "Invalid username or password. Please sign up if you don't have an account.",
        showSignupLink: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error:
          "Invalid username or password. Please sign up if you don't have an account.",
        showSignupLink: true,
      });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      userType: user.userType,
    };
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).render("login", {
      error: "An error occurred",
      showSignupLink: false,
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
};
