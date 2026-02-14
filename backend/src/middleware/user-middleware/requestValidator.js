const { body, query } = require("express-validator");

const makeRequestValidator = [
  body("payerId").notEmpty().withMessage("Payer is required."),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required.")
    .isInt({ gt: 0 })
    .withMessage("Amount must be greater than 0."),
  body("message")
    .optional()
    .isString()
    .withMessage("Enter valid message content."),
];

const getRequestValidator = [
  query("len").isInt({ gt: 0 }).withMessage("len must be greater than 0"),
  query("reqId").custom((value) => {
    if (value === "") return Promise.resolve();
    if (!value) throw new Error("reqId is required.");
    return Promise.resolve();
  }),
];

const acceptRequestValidator = [
  query("reqId").notEmpty().withMessage("reqId is required."),
  body("method").isIn(["wallet", "card"]).withMessage("Invalid method"),
  body("pin").notEmpty().withMessage("UPI pin is required"),
  body("message").isString().withMessage("message must be valid."),
];

const deniedRequestValidator = [
  query("reqId").notEmpty().withMessage("reqId is required."),
];

module.exports = {
  makeRequestValidator,
  getRequestValidator,
  acceptRequestValidator,
  deniedRequestValidator,
};
