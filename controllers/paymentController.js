const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeatures = require('../utils/apiFeatures')

/**
 * THIS METHOD DEPENDS ON THE IMPLEMENTATION OF PAYMENT GATEAWAY
 * It updates investor status to "paid"
 * @param {request} req it contains payment req.paymeny
 * @param {response} res return a response from sever
 */
exports.verifyPayment = catchAsync(async (req, res, next) => {
  // 1. Check payment success
  // 2. Update to "paid"
  // 3. update current_fund in projectModel
  if (req.investor.payment_status === "paid") {
    return next(new AppError('You have already paid this pledge'))
  }

  req.body.payment_status = "paid"

  next()
});
