const express = require("express");

const router = express.Router();

const handleFactory = require("../controllers/handleFactory");
const projectController = require("../controllers/projectContoller");
const authController = require("../controllers/authController");
const Project = require("../models/projectsModel");

router.route("/").get(projectController.getProjects);
router.route("/:id").get(handleFactory.getOne(Project));

router.use(authController.protects);

router
  .route("/create")
  .post(projectController.setCreatorId, projectController.createProject);

router
  .route("/:id/approve")
  .patch(
    authController.restrictedTo("admin"),
    projectController.setProject,
    projectController.approveProject
  );

router
  .route("/:id/join")
  .post(
    projectController.setProject,
    projectController.projectStatus("on-going"),
    projectController.isApproved,
    projectController.isAlreadyJoin,
    projectController.joinProject
  );

router
  .route("/:id/update")
  .patch(
    projectController.setProject,
    projectController.restrictUpdate,
    projectController.updateProject
  );


module.exports = router;
