const handleFactory = require("../controllers/handleFactory");
const Story = require("../models/storyModel");
const StoryModel = require("../models/storyModel");
const catchAsync = require("../utils/catchAsync");

exports.createStory = handleFactory.createOne(StoryModel);
exports.getStoryById = handleFactory.getOne(StoryModel);
exports.updateStory = handleFactory.updateOne(StoryModel);
exports.getStoriesAll = handleFactory.getAll(StoryModel);
exports.deleteStory = handleFactory.deleteOne(StoryModel); // not implemented yet

exports.removeStoryById = catchAsync(async (req, res, next) => {
  
  req.story.status = "deleted"
  await req.story.save()

  return res.status(200).json({
    status: "success",
    data: {
      message: "Your story has been deleted",
      story: req.story
    }
  });
});

// Referencing author in db Story
exports.setAuthorId = (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;
  next();
};
