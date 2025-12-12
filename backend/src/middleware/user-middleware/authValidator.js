const { body } = require("express-validator");

exports.validateRegister = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters"),
  body("fullname").notEmpty().withMessage("Fullname is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phoneNumber")
    .isMobilePhone("any")
    .isLength({ min: 10 })
    .withMessage("Valid phone number is required with at least 10 digits"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Valid date of birth is required"),
];

exports.validateLogin = [
  body("data")
    .notEmpty()
    .isString()
    .withMessage("Email or username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.validateOTP = [
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be valid"),
  body("email").isEmail().withMessage("Valid email is required"),
];

exports.validateEmail = [
  body("email").isEmail().withMessage("Valid email is required"),
];
