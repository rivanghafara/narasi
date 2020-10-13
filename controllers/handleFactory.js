const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find({});

    res.status(200).json({
      status: "success",
      result: doc.length,
      data: {
        data: doc,
      },
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
    console.log(req.body);
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
