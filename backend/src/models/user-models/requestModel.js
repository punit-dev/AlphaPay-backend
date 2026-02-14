const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    payerId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "APPROVED", "DENIED"],
    },
  },
  { timestamps: true },
);

requestSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const requestModel = mongoose.model("request", requestSchema);

module.exports = requestModel;
