const RequestModel = require("../../models/user-models/requestModel");
const asyncHandler = require("express-async-handler");
const UserModel = require("../../models/user-models/userModel");
const checkValidation = require("../../util/checkValidation");
const NotificationModel = require("../../models/user-models/notificationModel");
const { sendData } = require("../../util/sockets");
const CardModel = require("../../models/user-models/cardModel");
const TransactionModel = require("../../models/user-models/transactionModel");
const { comparePass } = require("../../util/hash");

/**
 * @route   POST /api/v1/users/requests/create
 * @desc    Create money request using payerId, amount and message(optional)
 * @access  Private
 */
const makeRequest = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { payerId, amount, message } = req.body;

  const isPayer = await UserModel.findById(payerId);

  if (!isPayer) {
    res.status(404);
    throw new Error("Payer not found.");
  }

  const request = await RequestModel.create({
    senderId: user._id,
    payerId: isPayer._id,
    amount: amount,
    message: message || `Request from ${user.fullname}`,
  });

  const notify = await NotificationModel.create({
    userId: isPayer._id,
    type: "request",
    action: "info",
    message: `You have received money request from ${user.fullname}`,
    data: {
      sender: user,
      payer: isPayer,
      request,
    },
  });

  if (isPayer.socketId) {
    sendData(isPayer.socketId, "request", notify);
  }

  res.status(201).json({ message: "Request create successfully.", request });
});

/**
 * @route   GET /api/v1/users/requests
 * @desc    Fetch all money requests.
 * @access  Private
 */
const getRequests = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);

  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;

  const { len, reqId } = req.query;

  if (reqId) {
    const request = await RequestModel.findById(reqId)
      .populate("senderId", "username upiId profilePic fullname")
      .populate("payerId", "username upiId profilePic fullname");
    return res.status(200).json({ message: "Fetch Request", request });
  }

  const requests = await RequestModel.find({
    $or: [{ senderId: user._id }, { payerId: user._id }],
  })
    .populate("senderId", "username upiId profilePic fullname")
    .populate("payerId", "username upiId profilePic fullname")
    .sort({ createdAt: -1 })
    .limit(parseInt(len) || 50);

  return res.status(200).json({ message: "Fetched requests", requests });
});

/**
 * @route   PUT /api/v1/users/requests/accept
 * @desc    Accept the money request.
 * @access  Private
 */
const acceptRequest = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const user = req.user;
  const { reqId } = req.query;
  const { method, cardId, pin, message } = req.body;

  const request = await RequestModel.findByIdAndUpdate(
    reqId,
    { status: "APPROVED" },
    { new: true },
  );
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  const isSender = await UserModel.findById(request.senderId);
  if (!isSender) {
    res.status(404);
    throw new Error("Sender not found.");
  }

  // Wallet balance check
  if (method === "wallet" && request.amount > user.walletBalance) {
    res.status(400);
    throw new Error("Your wallet balance is too low.");
  }

  // Card payment validation
  if (method === "card" && !cardId) {
    res.status(400);
    throw new Error("Card ID is required for card payments.");
  }

  const isCard = await CardModel.findById(cardId);
  if (method == "card" && !isCard) {
    res.status(404);
    throw new Error("Card not found.");
  }

  // Validate UPI Pin
  if (!(await comparePass(user.upiPin, pin))) {
    const failedTran = await TransactionModel.create({
      initiatedBy: "USER",
      payer: {
        userRef: user._id,
        transactionType: "DEBIT",
      },
      payee: {
        name: isSender.fullname,
        type: "user",
        userRef: isSender._id,
        accountOrPhone: isSender.phoneNumber,
        transactionType: "CREDIT",
      },
      amount: request.amount,
      method: {
        type: method,
        cardRef: method == "card" ? isCard._id : null,
      },
      status: "FAILED",
      category: "TRANSFER",
      message: "Transaction failed.",
    });

    res.status(400);
    throw new Error("Transaction failed. Please check details and try again.");
  }

  // SUCCESS Transaction
  const successTran = await TransactionModel.create({
    initiatedBy: "USER",
    payer: {
      userRef: user._id,
      transactionType: "DEBIT",
    },
    payee: {
      name: isSender.fullname,
      type: "user",
      userRef: isSender._id,
      accountOrPhone: isSender.phoneNumber,
    },
    amount: request.amount,
    method: {
      type: method,
      cardRef: method == "card" ? isCard._id : null,
    },
    status: "SUCCESS",
    message: message || "Paid",
    category: "TRANSFER",
  });

  // Deduct wallet amount if wallet used
  if (method == "wallet") {
    user.walletBalance -= request.amount;
  }

  // Update balances
  isSender.walletBalance += request.amount;

  await Promise.all([user.save(), isSender.save()]);

  const notify = await NotificationModel.insertMany([
    {
      userId: isSender._id,
      type: "transaction",
      action: "credit",
      message: `You have received ₹${request.amount} from ${user.fullname}`,
      data: {
        transactionId: successTran._id,
        amount: request.amount,
        from: user.fullname,
        to: isSender.fullname,
        status: successTran.status,
        transaction: successTran,
      },
      balance: isSender.walletBalance,
    },
    {
      userId: user._id,
      type: "transaction",
      action: "debit",
      message: `You sent ₹${request.amount} to ${isSender.fullname}`,
      data: {
        transactionId: successTran._id,
        amount: request.amount,
        from: user.fullname,
        to: isSender.fullname,
        status: successTran.status,
        transaction: successTran,
      },
      balance: user.walletBalance,
    },
  ]);

  //push a success transaction notification
  sendData(isSender.socketId, "tran", notify[0]);
  sendData(user.socketId, "tran", notify[1]);

  res
    .status(200)
    .json({
      message: "Money request Approved.",
      request,
      transaction: successTran,
    });
});

/**
 * @route   PUT /api/v1/users/requests/denied
 * @desc    Denied the money request.
 * @access  Private
 */
const deniedRequest = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { reqId } = req.query;

  const request = await RequestModel.findByIdAndUpdate(
    reqId,
    { status: "DENIED" },
    { new: true },
  );

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  const isSender = await UserModel.findById(request.senderId);

  if (!isSender) {
    res.status(404);
    throw new Error("Sender not found.");
  }

  const notify = await NotificationModel.create({
    userId: isSender._id,
    type: "request",
    action: "info",
    message: `Your money request is denied.`,
    data: {
      request,
    },
  });

  if (isSender.socketId) {
    sendData(isSender.socketId, "request", notify);
  }

  res
    .status(200)
    .json({ message: "Money request successfully denied.", request });
});

/**
 * @route   DELETE /api/v1/users/requests/delete
 * @desc    Delete money request.
 * @access  Private
 */
const deleteRequest = asyncHandler(async (req, res) => {
  const isNotValid = checkValidation(req);
  if (isNotValid) {
    res.status(400);
    throw isNotValid;
  }

  const { reqId } = req.query;

  const request = await RequestModel.findByIdAndDelete(reqId);
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  return res.status(200).json({ message: "Request successfully deleted." });
});

module.exports = {
  makeRequest,
  getRequests,
  acceptRequest,
  deniedRequest,
  deleteRequest,
};
