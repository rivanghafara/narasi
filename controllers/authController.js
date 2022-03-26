const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");

const User = require("../models/userModel");

const AppError = require("../utils/appError");
const secret = process.env.JWT_SECRET;

/**
 * 
 * @param {String} id It should be a string parameter
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * It is used in login and register
 * @param {Object} user User parameter is collected from req.body
 * @param {Number} statusCode set status code 
 * @param {response} res 
 */
const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), // 3 months expiration
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
  const isEmailExist = await User.findOne({ email: req.body.email }).exec()
  if (isEmailExist) {
    return next(new AppError("Email already exist", 403))
  }
  const newUser = await User.create(req.body);
  createToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide with correct email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createToken(user, 200, res);
});

/**
 * It is used to check if user has credential to access the route
 * @param {request} req contains req.header 
 * @param {response} res 
 * @param {next} next 
 */
exports.protects = catchAsync(async (req, res, next) => {
  // Check token and token should exist
  if (!req.headers.authorization) {
    return next(new AppError('You are not allowed to access this route', 401))
  }

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // check if token available
  if (!token) return next(new AppError("No Data Available", 404));

  // Verification ID in jwt
  const decoded = jwt.verify(token, secret, (err, jwtDecoded) => {
    if (err) {
      return next(new AppError("User does not exist", 404));
    }
    return jwtDecoded
  })

  if (!decoded) {
    return new AppError("User does not exist", 404);
  }

  // Find user in db with Id
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) return next(new AppError("User does not exist", 404));

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError('You do not have permission to perform this action', 403))
    next();
  };
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    status: 'Success',
    message: 'You are logged out'
  })
}

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. check use in db
  const user = await User.findById(req.user.id).select('+password')
  
  // 2. check if password and password confirm is identical
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('Make sure password and password confirmed are the same.', 401))
  }

  // 2. check if current password is correct
  if (!user.correctPassword(req.body.currentPassword, user.password)) {
    return next(new AppError('Your Current passwod is wrong.', 401))
  }
  

  // 3. update password
  user.password = req.body.password
  await user.save()

  // 4. create new token
  createToken(user, 201, res)
})