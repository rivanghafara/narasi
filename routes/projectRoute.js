const express = require("express");

const router = express.Router();

const projectController = require("../controllers/projectContoller");
const authController = require("../controllers/authController");

router.route("/").get(projectController.getProjects);

router
  .route("/create")
  .post(
    authController.protects,
    projectController.setCreatorId,
    projectController.createProject
  );

router
  .route("/:id/join")
  .post(
    authController.protects,
    projectController.isAlreadyJoin,
    projectController.joinProject
  );

module.exports = router;
