const express = require("express");
const route = express.Router();

const authMiddleware = require("../../middleware/user-middleware/authMiddleware");
const requestController = require("../../controllers/user-controllers/request.controller");
const requestValidator = require("../../middleware/user-middleware/requestValidator");

route.post(
  "/create",
  authMiddleware,
  requestValidator.makeRequestValidator,
  requestController.makeRequest,
);
route.get(
  "/",
  authMiddleware,
  requestValidator.getRequestValidator,
  requestController.getRequests,
);
route.put(
  "/accept",
  authMiddleware,
  requestValidator.acceptRequestValidator,
  requestController.acceptRequest,
);
route.put(
  "/denied",
  authMiddleware,
  requestValidator.deniedRequestValidator,
  requestController.deniedRequest,
);
route.delete(
  "/delete",
  authMiddleware,
  requestValidator.deniedRequestValidator,
  requestController.deleteRequest,
);

module.exports = route;
