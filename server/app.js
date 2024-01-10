const express = require('express');
const cors = require('cors');

const app = express();
// Increase the limit for request payload size (adjust the value as needed)
app.use(express.json({ limit: '50mb' }));
app.use(cors());

const studentsRouter = require('./routes/studentsRoute');
const documentRouter = require('./routes/documentsRoute');
const impDocumentRouter = require('./routes/impDocumentsRoute');
const transactionRouter = require('./routes/transactionRoute');
const employeeRouter = require('./routes/employeeRoute');
const feeStructureRouter = require('./routes/feeStructureRoute');
const taskRouter = require('./routes/taskRoute');
const scholarshipRouter = require('./routes/scholarshipRoute');

app.use('/api/student', studentsRouter);
app.use('/api/document', documentRouter);
app.use('/api/impdocument', impDocumentRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/feestructure', feeStructureRouter);
app.use('/api/task', taskRouter);
app.use('/api/scholarship', scholarshipRouter);

module.exports = app;
