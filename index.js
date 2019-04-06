const express = require('express');
const oracledb = require('oracledb');
const dbconfig = require('./config/dbconfig');

const app = express();

async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection(  {
      user          : dbconfig.user,
      password      : dbconfig.password,
      connectString : dbconfig.connectString
    });

    let result = await connection.execute(
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
}

run();


// Middleware
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});


// Requests

app.get('/', (req, res) => {
  res.send('Hi!')
});

app.listen(3000, () => console.log('Server ready'));