/* const express = require('express');
const app = express(); */

/* const app = require('https-localhost')();
// app is an express app, do what you usually do with express
app.listen(port); */

/* app.use = require('https-localhost')(); */
// Set CORS headers
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // allow any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

function nextPage() {
  onclick = function () {
    this.location.href = 'capture.html';
  };
}
