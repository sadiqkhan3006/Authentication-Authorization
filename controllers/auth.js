const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    //secure password //
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing Password",
      });
    }
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    return res.status(200).json({
      success: true,
      message: "User created Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "User cannot be created try again later..",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details  carefully",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please create your account",
      });
    }
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    //verify password and generate a jwt tokenn
    //the compare statement return true or false
    if (await bcrypt.compare(password, user.password)) {
      //password match toh login karwao bc
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      //convert user to object to add new fields because of schema restriction
      //user = user.toObject()
      user.token = token;
      user.password = undefined;
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3days=> 3 * 24 * 60 * 60 * 1000
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "user Logged in successfully",
      });
      // res.json({
      //   success: true,
      //   token,
      //   user,
      //   message: "user Logged in successfully",
      // });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password incorrect",
      });
    }
  } catch (err) {
    console.log("error message ", err.message);
    return res.status(500).json({
      suceess: false,
      message: "Login failure",
    });
  }
};
