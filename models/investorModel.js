const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema({
  project_name: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: [true, "project must have a name"],
  },
  investor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Project must have an creator"],
  },
  pledge: {
    type: Number,
    required: [true, "Project must have an pledge price"],
  },
  status: {
    type: String,
    enum: ["pending", "cancel", "paid"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

// investorSchema.pre('find', function (next) {
//   this.select("-__v");
// });

// investorSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'project_name',
//     select: 'project_name'
//   })
// });

const Investor = mongoose.model("Investor", investorSchema);

module.exports = Investor;
