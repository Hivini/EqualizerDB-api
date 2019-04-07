const express = require('express');
const oracledb = require('oracledb');
const dbconfig = require('./config/dbconfig');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

async function run(query) {

  let connection;
  let result;

  try {
    connection = await oracledb.getConnection(  {
      user          : dbconfig.user,
      password      : dbconfig.password,
      connectString : dbconfig.connectString
    });

    result = await connection.execute(
      query
    );
    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }

  return result;
}

/*
// Middleware
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});*/

// Requests

app.get('/', (req, res) => {
  run(req.query.query).then((data) => res.send(data));
});

app.listen(3000, () => console.log('Server ready'));
