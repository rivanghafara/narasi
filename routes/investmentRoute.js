const express = require('express')

const investmentController = require('../controllers/investmentController')
const paymentController = require('../controllers/paymentController')


const router = express.Router()


router.route("/").get(investmentController.getInvestment)
router
  .route("/:id/verify-payment")
  .patch(
    investmentController.getInvestmentById,
    paymentController.verifyPayment,
    investmentController.saveChange
  ) 

module.exports = router