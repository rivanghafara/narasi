const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    let filter = {};

    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .page();
    const doc = await features.dbQuery;

    res.status(200).json({
      status: "success",
      result: doc.length,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 5,
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndRemove(req.params.id);

    if (!doc) return next(new AppError("Document not found", 404));

    res.status(200).json({
      status: "success",
      data: "data has been removed",
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // if (!doc.approval.isApproved && req.body.approval.isApproved) return next(new AppError('Cannot be launched. Project is not approved.'))

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError("Document is not available", 404));

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) return next(new AppError("Document is not available", 404));

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
