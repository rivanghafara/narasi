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
  req.project = await Project.findById(req.params.id);

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
      return next(
        new AppError(
          `Your request is declined. This project is ${req.project.status}`,
          403
        )
      );

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

  if (user)
    return next(new AppError("You are already backed this project", 403));

  if (req.body.pledge === undefined || req.body.pledge < 1)
    return next(new AppError("You need to pledege with number", 400));
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
 * THIS METHOD DEPENDS ON THE IMPLEMENTATION OF PAYMENT GATEAWAY
 * It updates investor status to "paid"
 * @param {request} req it contains payment req.paymeny
 * @param {response} res return a response from sever
 */
exports.verifyPayment = catchAsync(async (req, res) => {
  // 1. Check payment success
  // 2. Update to "paid"
  // 3. update current_fund in projectModel
});

exports.restrictUpdate = (req, res, next) => {
  
  if (req.user.id !== req.project.creator.id) return next(new AppError('Not found', 404))
  if (req.project.approval.isApproved) return next(new AppError('Project has been approved. Editing is not allowed', 403))
  if (req.project.status === 'on-going') return next(new AppError('Cannot update an on-going project', 403))

  let payload = {
    "project_name": req.body.project_name || req.project.project_name,
    "target_end": req.body.target_end || req.project.target_end,
    "target_fund": req.body.target_fund || req.project.target_fund,
    "description": req.body.description || req.project.description,
    "status": req.body.status || req.project.status
  }

  req.body = payload
  next()
}

exports.getProjects = handleFactory.getAll(Project);
exports.createProject = handleFactory.createOne(Project);
exports.joinProject = handleFactory.createOne(Investor);
exports.updateProject = handleFactory.updateOne(Project);
