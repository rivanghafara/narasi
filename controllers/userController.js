const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id)
  
  if (!user) return new AppError('No data available')

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })

});
