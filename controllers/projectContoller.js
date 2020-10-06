const Investor = require("../models/investorModel");
const Project = require("../models/projectsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handleFactory = require("./handleFactory");

exports.setCreatorId = (req, res, next) => {
  if (!req.body.creator) req.body.creator = req.user.id;

  next();
};

exports.isAlreadyJoin = catchAsync(async (req, res, next) => {
  // cek apakah ada parameter
  if (!req.params.id) return next(new AppError("Not found", 404));

  // cek apakah project exist
  const doc = await Project.findById(req.params.id);
  if (!doc) return next(new AppError("Not found", 404));

  // cek apakah user sudah pernah pledge ke project yg sama
  const user = await Investor.find({
    investor: req.user.id,
    project_name: doc.id,
  }).exec();

  if (user.length)
    return next(new AppError("You are already backed this project", 403));

  console.log(user);

  req.body.project_name = doc;
  req.body.investor = req.user;

  next();
});

exports.approveProject = catchAsync(async (req, res, next) => {
  // cek apakah ada parameter
  if (!req.params.id) return next(new AppError("Not found", 404));

  const project = await Project.findByIdAndUpdate(req.params.id);
  
  if (project.approval.isApproved)
    return next(new AppError("This project is already aprroved", 403))

  project.approval.isApproved = true;
  project.save()

  res.status(200).json({
    status: "success",
    data: {
      data: project,
    },
  });
});

exports.getProjects = handleFactory.getAll(Project);
exports.createProject = handleFactory.createOne(Project);
exports.joinProject = handleFactory.createOne(Investor);
