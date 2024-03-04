const express = require('express');
const morgan = require('morgan');
const cors = require("cors");

// Security 
const rateLimit = require('express-rate-limit');
const helmet= require('helmet');
const mongoSanitize= require('express-mongo-sanitize');
const xss= require('xss-clean');
const hpp= require('hpp');
const cookieParser = require('cookie-parser');

// Import Error Routes
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// const errorHandler = require('./middleware/errorHandler');

// Import routes
const userRouter = require('./routes/userRoutes');


const app = express();

//MIDDLEWARES
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

//Limit requests from the same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please try again in an hour!'
})

app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter Pollution // parameters(properties) which we pass multiple values in query string
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity'
    ]
}))

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}))

// Serving Static file
app.use(express.static(`${__dirname}/public`))

// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers)
    next();
});

app.use(cookieParser());
// 3) ROUTES 
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404 ))
})

// app.use(errorHandler);
app.use(globalErrorHandler);

module.exports = app;