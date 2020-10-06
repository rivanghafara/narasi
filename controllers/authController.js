const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");

const User = require("../models/userModel");
const StoryModel = require("../models/storyModel");

const AppError = require("../utils/appError");
const secret = process.env.JWT_SECRET;

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cannot manipualate or delete itcookies
  };

  res.cookie("jwt", token, cookieOptions); // Store cookies

  user.password = undefined; // Remove password so it won't appears in response

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(
      new AppError("Please provide with correct email and password", 400)
    );

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createToken(user, 200, res);
});

exports.protects = catchAsync(async (req, res, next) => {
  // Check token and token should exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new AppError("No Data Available", 404));

  // Verification ID in jwt
  const decoded = await promisify(jwt.verify)(token, secret);

  // Find user in db with Id
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) return next(new AppError("User does not exist", 404));

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.allowedOnly = catchAsync(async (req, res, next) => {
  const story = await StoryModel.findById(req.params.id);
  if (!story) return next(new AppError("No Data Available", 404));
  if (story.author.id !== req.user.id)
    return next(new AppError("No Data Available", 404));

  req.story = story;
  next();
});

exports.restrictedTo = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError('You do not have permission to perform this action', 403))

    next();
  };
};
