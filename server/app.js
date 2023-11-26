const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const studentsRouter = require('./routes/studentsRoute');
const documentRouter = require('./routes/documentsRoute');
const transactionRouter = require('./routes/transactionRoute');
const employeeRouter = require('./routes/employeeRoute');

app.use('/api/student', studentsRouter);
app.use('/api/document', documentRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/employee', employeeRouter);

module.exports = app;
