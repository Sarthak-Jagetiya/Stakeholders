const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const expressSanitizer = require('express-sanitizer');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP. Please try again in an hour!',
// });

// app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '50mb' }));

// Data sanitization against MySQL query injection
app.use(expressSanitizer());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3030'];
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins array
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Enable pre-flight requests
app.options('/api/user/login', cors({ credentials: true }));

app.use(cookieParser());

// Your custom CORS headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3030');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// app.use((req, res, next) => {
//   console.log('Cookies:', req.cookies);
//   next();
// });

// app.use((req, res, next) => {
//   const headers = req.headers;
//   console.log('Request Headers:', headers);
//   next();
// });

require('dotenv').config();

const studentsRouter = require('./routes/studentsRoute');
const documentRouter = require('./routes/documentsRoute');
const impDocumentRouter = require('./routes/impDocumentsRoute');
const resultRouter = require('./routes/resultRoute');
const transactionRouter = require('./routes/transactionRoute');
const employeeRouter = require('./routes/employeeRoute');
const feeStructureRouter = require('./routes/feeStructureRoute');
const taskRouter = require('./routes/taskRoute');
const scholarshipRouter = require('./routes/scholarshipRoute');
const userRouter = require('./routes/userRoute');
const otpRouter = require('./routes/otpRoute');
const logRouter = require('./routes/logsRoute');

app.use('/api/student', studentsRouter);
app.use('/api/document', documentRouter);
app.use('/api/impdocument', impDocumentRouter);
app.use('/api/result', resultRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/feestructure', feeStructureRouter);
app.use('/api/task', taskRouter);
app.use('/api/scholarship', scholarshipRouter);
app.use('/api/user', userRouter);
app.use('/api/otp', otpRouter);
app.use('/api/log', logRouter);

module.exports = app;
