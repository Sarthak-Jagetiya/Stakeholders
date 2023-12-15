const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const studentsRouter = require('./routes/studentsRoute');
const documentRouter = require('./routes/documentsRoute');
const impDocumentRouter = require('./routes/impDocumentsRoute');
const transactionRouter = require('./routes/transactionRoute');
const employeeRouter = require('./routes/employeeRoute');
const feeStructureRouter = require('./routes/feeStructureRoute');
const taskRouter = require('./routes/taskRoute');

app.use('/api/student', studentsRouter);
app.use('/api/document', documentRouter);
app.use('/api/impdocument', impDocumentRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/feestructure', feeStructureRouter);
app.use('/api/task', taskRouter);

module.exports = app;
