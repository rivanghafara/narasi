const mongoose = require("mongoose");

const Investor = require("./investorModel");

const projectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: [true, "project must have a name"],
    minlength: [1, "project name should have longer 1 word"],
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Project must have an creator"],
  },
  current_fund: {
    type: Number,
    default: 0
  },
  target_fund: {
    type: Number,
    required: [true, "Project must have target fund"],
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
    enum: ["drafted", "on-going", "ended", "canceled"],
    default: "drafted",
  },
  approval: {
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

projectSchema.pre(/^find/, function (next) {
  this.select("-__v");
  this.start = Date.now();

  next();
});

projectSchema.pre(/^find/, function (next) {
  this.populate({
    path: "creator",
    select: "-investing -role",
  });

  next();
});


/**
 * This does not work when get all projects
 */
projectSchema.post(/^find/, async function (doc, next) {
  if (doc.length > 1) return next()

  const total = await Investor.aggregate([
    {
      $match: {
        status: "paid",
        project_id: new mongoose.Types.ObjectId(doc.id),
      },
    },
    {
      $group: {
        _id: "$project_id",
        total: {
          $sum: "$pledge",
        },
      },
    },
  ]);

  if (total.length > 0) doc.current_fund = total[0].total
  
  next();
});

projectSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds!`);

  next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
