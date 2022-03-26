const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);



router.use(authController.protects)

router.get("/logout", authController.logout);

router.get("/profile", userController.getMe);

router.get(
  "/all-users",
  authController.restrictedTo("admin"),
  userController.getUsers
);

router.patch(
  "/upload",
  uploadController.validateUserImage,
  uploadController.uploadImage
);

router.patch('/updatePassword', authController.updatePassword)

module.exports = router;
