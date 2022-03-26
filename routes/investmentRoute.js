const express = require("express");

const investmentController = require("../controllers/investmentController");
const paymentController = require("../controllers/paymentController");
const projectController = require("../controllers/projectContoller");

const router = express.Router();

router.route("/").get(investmentController.getInvestment);
router
  .route("/:id/save-payment")
  .patch(
    investmentController.getInvestmentById,
    paymentController.checkingPayment,
    investmentController.saveChange
  );

router
  .route("/:id/verify-payment")
  .patch(
    investmentController.getInvestmentById,
    paymentController.verifyPayment,
    projectController.updateProject
  );

module.exports = router;
