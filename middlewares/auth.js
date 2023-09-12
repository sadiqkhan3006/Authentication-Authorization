const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = (req, res, next) => {
  try {
    //extract jwt token //
    console.log("body: ", req.body.token);
    console.log("cookie: ", req.cookies.token);
    console.log("header: ", req.header("Authorization"));
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }
    //verify token //
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (err) {
      res.status(401).json({
        success: false,
        message: "token is invalid ",
      });
    }
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Something went wrong while verifying token",
    });
  }
};
exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      res.status(401).json({
        success: false,
        message: "This is protected route for students",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      res.status(401).json({
        success: false,
        message: "This is protected route for Admins only",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};
