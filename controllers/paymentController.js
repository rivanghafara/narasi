const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const projectController = require("../controllers/projectContoller");
const Project = require("../models/projectsModel");
const Investor = require("../models/investorModel");

exports.checkingPayment = catchAsync(async (req, res, next) => {
  // 1. Check payment success
  // 2. Update to "paid"
  // 3. update current_fund in projectModel
  if (req.investor.payment_status === "paid") {
    return next(new AppError("You have already paid this pledge"));
  }

  req.body.payment_status = "paid";

  next();
});

// this should be automate
exports.verifyPayment = catchAsync(async (req, res, next) => {
  console.log(req.investor);
  // // get project id
  const project = await Project.findById(req.investor.project_id);
  if (!project) return next(new AppError("Project not found", 404));

  // // check if trx status is paid
  // // if not paid, return initial data)
  if (req.investor.payment_status !== "paid") {
    return next(new AppError("You have not pay this pledge"));
  }
  // // if paid set the sum of amount and current fund
  project.current_fund = project.current_fund + req.investor.pledge;

  // // save the project
  console.log(project);
  next();
});
