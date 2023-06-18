const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailSender");
const app = express();
require("dotenv").config();
app.use(express.json());

const registirationController = {
  register: async (req, res) => {
    User.findOne({ email: req.body.email })
      .then(async (user) => {
        if (user?.isVerified) {
          return res.status(400).json({ email: "Email already exists" });
        } else {
          const randomCode = Math.floor(1000 + Math.random() * 9000);
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const user = await User.create({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            verificationCode: randomCode,
          });
          sendEmail(user.email, "Registration", randomCode);
          res.json(user);
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  },
  login: async (req, res) => {
    User.findOne({ email: req.body.email })
      .then(async (user) => {
        if (user) {
          const validPassword = bcrypt.compare(
            req.body.password,
            user.password
          );
          if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
          }
          if (!user.isVerified) {
            return res.status(401).json({ message: "Email is not verified" });
          }
          const accessToken = jwt.sign(
            { email: req.body.email },
            process.env.ACCESS_TOKEN_SECRET
          );
          res.json({ userId: user._id, accessToken: accessToken });
        } else {
          res.status(401).json({ message: "User Not Found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  },
  confirmEmail: async (req, res) => {
    User.findOne({
      email: req.body.email,
      verificationCode: req.body.verificationCode,
    })
      .then((user) => {
        if (user) {
          user.isVerified = true;
          user.save();
          res.json({ message: "Email is verified" });
        } else {
          res.status(401).json({ message: "Invalid email or code" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  },
  forgotPassword: async (req, res) => {
    User.findOne({ email: req.body.email })
      .then(async (user) => {
        if (user) {
          if (!user.isVerified) {
            return res.status(401).json({ message: "Email is not verified" });
          }
          const randomCode = Math.floor(1000 + Math.random() * 9000);
          user.verificationCode = randomCode;
          user.save();
          sendEmail(user.email, "Forgot Password", randomCode);
          res.json(user);
        } else {
          res.status(401).json({ message: "User Not Found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  },
  updatePassword: async (req, res) => {
    User.findOne({ email: req.body.email })
      .then(async (user) => {
        if (user) {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          user.password = hashedPassword;
          user.save();
          res.json(user);
        } else {
          res.status(401).json({ message: "User Not Found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  },
};

module.exports = registirationController;
