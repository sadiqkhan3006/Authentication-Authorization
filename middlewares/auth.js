const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = (req, res, next) => {
  try {
    //extract jwt token //
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }
    //verify token //
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
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
