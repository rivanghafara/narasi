const Investor = require("../models/investorModel");
const Project = require("../models/projectsModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  // const projects = await Project.find({ creator: req.user.id });
  // const investment = await Investor.find({ investor_id: req.user.id });

  if (!user) return new AppError("No data available");

  res.status(200).json({
    status: "success",
    data: {
      user,
      // project_result: projects.length,
      // // project_created: projects,
      // // backed_result: investment.length,
      // // backed_project: investment,
    },
  });
});
