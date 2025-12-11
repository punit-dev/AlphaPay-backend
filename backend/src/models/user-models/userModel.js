const mongoose = require("mongoose");
const { hashPass } = require("../../util/hash");
const encrypt = require("mongoose-encryption");

const avatars = [
  "http://localhost:3000/assets/avatar/male1.png",
  "http://localhost:3000/assets/avatar/female1.png",
  "http://localhost:3000/assets/avatar/male2.png",
  "http://localhost:3000/assets/avatar/female2.png",
  "http://localhost:3000/assets/avatar/male3.png",
  "http://localhost:3000/assets/avatar/female3.png",
  "http://localhost:3000/assets/avatar/male4.png",
  "http://localhost:3000/assets/avatar/female4.png",
  "http://localhost:3000/assets/avatar/male5.png",
  "http://localhost:3000/assets/avatar/female5.png",
];

const UserSchema = new mongoose.Schema(
  {
    socketId: {
      type: String,
      default: null,
    },
    upiId: {
      type: String,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      min: [5, "username must be have 5 characters"],
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, "Password minimum 8"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isVerifiedEmail: {
      type: Boolean,
      required: true,
      default: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isVerifiedPhoneNumber: {
      type: Boolean,
      default: false,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    upiPin: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    profilePic: {
      type: String,
      enum: avatars,
      default: () => avatars[Math.floor(Math.random() * avatars.length)],
    },
    otpToken: {
      type: String,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.upiId && this.username) {
    const username = this.username;
    this.upiId = `${username}@alphapay`;
  }
  if (this.isModified("upiPin")) {
    this.upiPin = await hashPass(this.upiPin, 10);
  }
  if (this.isModified("password")) {
    this.password = await hashPass(this.password, 10);
  }
  next();
});

UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password;
    delete ret.lastActiveAt;
    delete ret.otpToken;
    delete ret.upiPin;
    delete ret.socketId;
    return ret;
  },
});

const encKey = process.env.ENCRYPTION_KEY;
const sigKey = process.env.SIG_KEY;

UserSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["dateOfBirth"],
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
