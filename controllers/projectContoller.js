const Investor = require("../models/investorModel");
const Project = require("../models/projectsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handleFactory = require("./handleFactory");

/**
 * set creator to req.body.creator. Use when create Project
 * @param {request} req contain body with creator data
 * @param {response} res
 * @param {next} next
 */
exports.setCreatorId = (req, res, next) => {
  if (!req.body.creator) req.body.creator = req.user.id;

  next();
};


/**
 * Set project to req.project
 * @param {request} req contain params of project id
 * @param {response} res
 * @param {next} next
 */
exports.setProject = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError("Data is not available", 404));
  req.project = await Project.findByIdAndUpdate(req.params.id);

  next();
});

/**
 * Check if project is approved by admin. Use when user joining project
 * @param {request} req contain req.project for verifying
 * @param {response} res
 * @param {next} next
 */
exports.isApproved = (req, res, next) => {
  if (!req.project.approval.isApproved)
    return next(new AppError("Project is not yet approved by admin", 403));

  next();
};

/**
 * Check if project is launched (after approved by admin). Use when user joining project
 * @param  {...any} status Status of the project 
 */
exports.projectStatus = (...status) => {
  return (req, res, next) => {
    if (!status.includes(req.project.status))
      return next(new AppError(`Your pledge is declined. This project is ${req.project.status}`, 403));

    next();
  };
};

exports.isAlreadyJoin = catchAsync(async (req, res, next) => {
  // cek apakah user sudah pernah pledge ke project yg sama
  const user = await Investor.find({
    investor_id: req.user.id,
    project_id: req.project.id,
  }).exec();

  if (user.length)
    return next(new AppError("You are already backed this project", 403));

  req.body.project_id = req.project.id;
  req.body.investor_id = req.user;
  next();
});

exports.approveProject = catchAsync(async (req, res, next) => {
  if (req.project.approval.isApproved)
    return next(new AppError("This project is already aprroved.", 403));

  req.project.approval.isApproved = true;
  await req.project.save();

  res.status(200).json({
    status: "success",
    data: {
      data: req.project,
    },
  });
});

exports.getProjects = handleFactory.getAll(Project);
exports.createProject = handleFactory.createOne(Project);
exports.joinProject = handleFactory.createOne(Investor);
exports.updateProject = handleFactory.updateOne(Project)
