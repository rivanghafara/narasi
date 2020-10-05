const express = require("express");
const morgan = require('morgan')

const globalErrorHandler = require('./controllers/errorController');

const app = express();

const userRouter = require('./routes/userRoute')
const storyRouter = require('./routes/storyRoute')
const projectRouter = require('./routes/projectRoute')

app.use(morgan('dev')) // This is for logging

app.use(express.json({limit: '10kb'}))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/projects', projectRouter)
app.use('/api/v1/stories', storyRouter)

app.use(globalErrorHandler)

module.exports = app