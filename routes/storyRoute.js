const express = require("express");
const router = express.Router();

const storyController = require("../controllers/storyController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(storyController.getStoriesAll)
  .post(
    authController.protects,
    storyController.setAuthorId,
    storyController.createStory
  );

router
  .route("/:id")
  .get(storyController.getStoryById)
  .patch(storyController.updateStory)
  .delete(authController.protects, authController.allowedOnly, storyController.removeStoryById)

module.exports = router;
