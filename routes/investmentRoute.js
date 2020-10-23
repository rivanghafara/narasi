const express = require('express')

const investmentController = require('../controllers/investmentController')
const router = express.Router()


router.route('/').get(investmentController.getInvestment)

module.exports = router