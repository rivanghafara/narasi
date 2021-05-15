const multer = require("multer");
const User = require("../models/userModel");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users");
  },
  filename: function (req, file, cb) {
    if (typeof req.user === "undefined" || typeof req.user.id === "undefined") {
      return cb(
        new AppError("You are not authorize to do this action", 404),
        false
      );
    }
    writeFile = file.fieldname + "_" + req.user.id || "default";
    cb(null, writeFile + "_primary.jpg");
  },
});

const upload = multer({ storage: userStorage });

exports.validateUserImage = upload.single("userImage");

exports.uploadImage = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      images: req.file.path,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) return next(new AppError("Document not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});
