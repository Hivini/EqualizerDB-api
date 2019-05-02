const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./_helpers/db');
const {jwt} = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const app = express();

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(cors());

// Secure the API
app.use(jwt());

// API routes
app.use('/users', require('./users/user.controller'));
app.use('/', require('./home/home.controller'));
app.use('/teams', require('./teams/team.controller'));
app.use('/projects', require('./projects/project.controller'));
app.use('/interfaces', require('./interfaces/interface.controller'));
app.use('/settings', require('./settings/settings.controller'));
// Error handler
app.use(errorHandler);

app.listen(3000, () => console.log('Server ready'));

process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  process.exit(1);
});
