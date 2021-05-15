const express = require("express");
const morgan = require('morgan')
const cors = require('cors')

const globalErrorHandler = require('./controllers/errorController');

const app = express();

const userRouter = require('./routes/userRoute')
const projectRouter = require('./routes/projectRoute')
const investmentRouter = require('./routes/investmentRoute')

app.use(cors())

app.use(morgan('dev')) // This is for logging

app.use(express.json({limit: '10kb'}))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/projects', projectRouter)
app.use('/api/v1/investment', investmentRouter)

app.use(globalErrorHandler)

module.exports = app