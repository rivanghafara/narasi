const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Story must have a title"],
    minlength: [1, "Title should have longer name"],
  },
  slug: {
    type: String,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Narasi must have author"],
  },
  body: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: ['drafted', 'published', 'deleted'],
    default: 'drafted'
  }
});

storySchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name",
  });

  next();
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
