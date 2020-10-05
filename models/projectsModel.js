const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: [true, "project must have a name"],
    minlength: [1, "project name should have longer 1 word"],
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Campaign must have an creator"],
  },
  target_fund: {
    type: Number,
    required: [true, "Campaign must have target fund"],
  },
  target_end: {
    type: Date,
    default: Date.now(),
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["drafted", "on-going", "funded", "ended"],
    default: "drafted",
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});


projectSchema.pre(/^find/, function (next) {
  this.select('-__v')
  this.start = Date.now()

  next();
});

projectSchema.pre(/^find/, function (next) {
  this.populate({
    path: "creator",
    select: '-investing',
  });

  next();
});

projectSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds!`);

  next()
})

// campaignSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "creator",
//     select: "name",
//     select: "-__v -funding"
//   });

//   next();
// });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
