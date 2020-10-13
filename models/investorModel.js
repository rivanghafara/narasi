const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: [true, "project must have a name"],
  },
  investor_id: {
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
  pledge_at: {
    type: Date,
    default: Date.now(),
  },
});

investorSchema.pre('find', function (next) {
  this.select("-__v -investor");

  next()
});

investorSchema.pre('find', function (next) {
  this.populate({
    path: 'project_id',
    select:'-creator -approval'
  })

  next()
});


const Investor = mongoose.model("Investor", investorSchema);

module.exports = Investor;
