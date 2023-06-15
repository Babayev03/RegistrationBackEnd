const express = require("express");
const registirationController = require("../controllers/registirationController");
const { body } = require("express-validator");
const validate = require("../helper/validator");
const registirationRouter = express.Router();

registirationRouter.post(
  "/register",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .withMessage("Password must contain at least one letter and one number"),
  ],
  validate,
  registirationController.register
);
registirationRouter.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  registirationController.login
);
registirationRouter.post(
  "/forgot-password",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
  ],
  validate,
  registirationController.forgotPassword
);
registirationRouter.post(
  "/confirm-email",
  registirationController.confirmEmail
);
registirationRouter.post(
  "/update-password",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .withMessage("Password must contain at least one letter and one number"),
  ],
  validate,
  registirationController.updatePassword
);

module.exports = registirationRouter;
