const Investor = require("../models/investorModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync")
const handleFactory = require("./handleFactory");

exports.getInvestment = handleFactory.getAll(Investor)
exports.getInvestmentById = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError("Data is not available", 404))
  req.investor = await Investor.findById(req.params.id)
  
  // console.log(req.investor);

  next()
})

exports.saveChange = handleFactory.updateOne(Investor)