const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';
const app = express();
app.use(express.static(`${__dirname}/dist/`));
app.listen(port, host);
