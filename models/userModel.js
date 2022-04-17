const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name should not be empty"],
    minlength: [1, "Name should not be empty"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: [8, "Password should longer than 8 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  images: {
    type: String,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
});

userSchema.pre(/^find/, function (next) {
  this.select("-__v");

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// candidate password is password stored in db
// userPassword is user input
userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  // create resetToken
  const resetToken = crypto.randomBytes(32).toString("hex");

  // encrypt resetToken
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // create reset token expired date
  this.passwordResetExpires = Date.now() + 10 * 600 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
