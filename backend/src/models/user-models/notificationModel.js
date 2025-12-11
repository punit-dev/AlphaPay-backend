const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["transaction", "bill", "card", "alert"],
    },
    action: {
      type: String,
      required: true,
      enum: ["credit", "debit", "added", "deleted", "due", "info"],
    },
    message: {
      type: String,
      required: true,
    },
    data: { type: Object },
    balance: { type: Number },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

NotificationSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const notificationModel = mongoose.model("notification", NotificationSchema);

module.exports = notificationModel;
