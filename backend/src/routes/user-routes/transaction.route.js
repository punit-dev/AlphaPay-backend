const express = require("express");
const route = express.Router();

const authMiddleware = require("../../middleware/user-middleware/authMiddleware");
const TranController = require("../../controllers/user-controllers/transaction.controller");
const tranValidator = require("../../middleware/user-middleware/transactionValidator");

route.use(authMiddleware);

route.post(
  "/user-to-user",
  tranValidator.userToUserValidator,
  TranController.userToUserTransaction,
);
route.post(
  "/user-to-bill",
  tranValidator.userToBillValidator,
  TranController.userToBillTransaction,
);
route.post(
  "/wallet-recharge",
  tranValidator.walletRechargeValidator,
  TranController.walletRecharge,
);
route.get(
  "/get-transaction-by-id",
  tranValidator.getTransactionByIdValidator,
  TranController.getTransactionById,
);
route.get("/", tranValidator.checkLimit, TranController.getTransaction);

module.exports = route;
