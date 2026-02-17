const rateLimit = require("express-rate-limit");

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

exports.transactionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?._id,
});

exports.searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => req.user?._id || req.ip,
});

exports.generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
});
