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

projectSchema.post(/^find/, async function (doc, next) {
  let investor_id = new mongoose.Types.ObjectId(doc.id);

  if (doc.length > 1) {
    investor_id = "";
  }

  console.log(doc);
  const total = await Investor.aggregate([
    {
      $match: {
        status: "paid",
        project_id: undefined,
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

  doc.current_fund = total[0].total

  console.log(total);
  next();
});

projectSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds!`);

  next();
});

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
