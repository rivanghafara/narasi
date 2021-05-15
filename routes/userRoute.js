const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.get("/profile", authController.protects, userController.getMe);

router.get(
  "/all-users",
  authController.protects,
  authController.restrictedTo("admin"),
  userController.getUsers
);

router.patch(
  "/upload",
  authController.protects,
  uploadController.validateUserImage,
  uploadController.uploadImage
);

module.exports = router;
