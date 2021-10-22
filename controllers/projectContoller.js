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
      return next(new AppError(`Your request is declined. This project is ${req.project.status}`, 403));
    next();
  };
};

/**
 * Check if user has already joined the project
 * If 'false' then set to 'true'
 * If 'true' then return error
 * @param {request} req contain user.id and project.id
 * @param {response} res
 * @param {next} next it will next to return error
 */
exports.isAlreadyJoin = catchAsync(async (req, res, next) => {
  // cek apakah user sudah pernah pledge ke project yg sama
  const user = await Investor.findOne({
    investor_id: req.user.id,
    project_id: req.project.id,
  }).exec();

  const project = await Project.findById(req.project.id)

  // creator tidak boleh pledge project nya sendiri
  if (req.user.id === project.creator.id) {
    return next(new AppError("Creator cannot backed your own project", 403))
  }

  if (user) {
    return next(new AppError("You are already backed this project", 403));
  }

  if (req.body.pledge === undefined || req.body.pledge < 1) {
    return next(new AppError("You need to pledege with number", 400));
  }
  req.body.project_id = req.project.id;
  req.body.investor_id = req.user;

  next();
});

/**
 * Set project to 'approved' but this restricted only to admin
 * @param {request} req contain params of project.approval.isApproved
 * @param {response} res
 * @param {next} next it will next by returning error
 */
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

/**
 * Set project to req.project
 * @param {request} req contain params of project id
 * @param {response} res
 * @param {next} next
 */
exports.setProject = async (req, res, next) => {
  if (!req.params.id) return next(new AppError("Data is not available", 404));
  try {
    req.project = await Project.findById(req.params.id);
  } catch (error) {
    return next(new AppError("Data is not available", 404));
  }

  next();
};

exports.restrictUpdate = (req, res, next) => {
  if (req.user.id !== req.project.creator.id) {
    return next(new AppError("Unauthorized", 401));
  }
  if (req.body.status) {
    return next(new AppError('Invalid route to update status of this project.', 403))
  }
  if (req.project.approval.isApproved) {
    return next(new AppError("Project has been approved. Editing is not allowed", 403));
  }
  if (req.project.status === "on-going") {
    return next(new AppError("Cannot update an on-going project", 403));
  }

  let payload = {
    project_name: req.body.project_name || req.project.project_name,
    target_end: req.body.target_end || req.project.target_end,
    target_fund: req.body.target_fund || req.project.target_fund,
    description: req.body.description || req.project.description,
  };

  req.body = payload;
  next();
};

exports.prepareLaunch = (req, res, next) => {
  if (req.user.id !== req.project.creator.id) {
    return next(new AppError("Unauthorized", 401));
  }
  if (!req.project.approval.isApproved) {
    return next(new AppError("Project has not been approved. Launching project is not allowed", 403));
  }
  if (req.project.status !== 'drafted') {
    return next(new AppError(`Project has already ${(req.project.status === 'on-going') ? 'launched' : req.project.status}`, 403))
  }

  let payload = {
    status: req.body.status || req.project.status
  }

  req.body = payload

  next()
}

exports.getProjects = handleFactory.getAll(Project);
exports.createProject = handleFactory.createOne(Project);
exports.joinProject = handleFactory.createOne(Investor);
exports.updateProject = handleFactory.updateOne(Project);
