const Investor = require("../models/investorModel");


const handleFactory = require("./handleFactory");

exports.getInvestment = handleFactory.getAll(Investor)