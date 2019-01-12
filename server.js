// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
const api = require('./server/routes/api');

const app = express();

// console.log('No value for SEND_EMAIL_AUTH_USER yet:', process.env.SEND_EMAIL_AUTH_USER);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

// console.log('Now the value for SEND_EMAIL_AUTH_USER is:', process.env.SEND_EMAIL_AUTH_USER);

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist/my-app')));

// Set our api routes
app.use('/api', api);


// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/my-app/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

app.use(function(req, res, next) {
  if(!req.secure || port == '8080') {
    return res.redirect('https://cjphotosfl.com');
  }
  next();
});

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
