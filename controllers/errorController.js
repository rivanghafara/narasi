const AppError = require('./../utils/appError')
const tempStage = 'development'


const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please login!', 401)

const handleJWTExpiredError = () => new AppError('Token has expired. Please login!', 401)

const sendErrorDev = (err, req, res) => {
    // A) API CALL
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // B) RENDERED WEBSITE
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    });
};

const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
      // A) Operational, trusted error: send message to client
      if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message
        });
      }
      // B) Programming or other unknown error: don't leak error details
      // 1) Log error
      console.error('ERROR 💥', err);
      // 2) Send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  
    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      console.log(err);
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
      title: 'aha went wrong!',
      msg: 'Please try again later.'
    });
  };

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'Internal Server Error'

    /**
     * NOTE: ENABLE THIS WHEN PROJECT HAS BEEN FINISHED
     * DUE TO DEVELOPING API FOR PRODUCTION AND DEVELOPMENT STAGES,
     * AND MOVING FROM EACH STAGES ARE DIFFICULT
     * ENABLE IT WHEN THIS FEATURE FINISH
    */

    // if (process.env.NODE_ENV === 'development') {
    if (tempStage === 'development') {
        sendErrorDev(err, req, res)
        // } else if (process.env.NODE_ENV === 'production') {
    } else if (tempStage === 'production') {
        let error = { ...err }
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError()
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

        sendErrorProd(error, req, res)
    }

}