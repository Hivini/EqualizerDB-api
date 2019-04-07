const express = require('express');
const oracledb = require('oracledb');
const dbconfig = require('./config/dbconfig');
const cors = require('cors');

const app = express();

app.use(cors());

async function run() {

  let connection;
  let result;

  try {
    connection = await oracledb.getConnection(  {
      user          : dbconfig.user,
      password      : dbconfig.password,
      connectString : dbconfig.connectString
    });

    result = await connection.execute(
      'SELECT * FROM NARUTO'
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
  run().then((data) => res.send(data));
});

app.listen(3000, () => console.log('Server ready'));
