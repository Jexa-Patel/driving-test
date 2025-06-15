exports.isAuthenticated = (req, res, next) => { 
  if (req.session.user && req.session.user.id) {
    next();
  } else {
    res.redirect("/login");
  }
};

exports.isDriver = (req, res, next) => {
  if (req.session.user && req.session.user.userType === "Driver") {
    next();
  } else {
    res.status(403).send("Access denied. Drivers only.");
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.userType === "Admin") {
    next();
  } else {
    res.status(403).send("Access denied. Admins only.");
  }
};

exports.isExaminer = (req, res, next) => {
  if (req.session.user && req.session.user.userType === "Examiner") {
    next();
  } else {
    res.status(403).send("Access denied. Examiners only.");
  }
};
