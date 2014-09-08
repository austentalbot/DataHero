var babyparse = require('babyparse');
var mysql = require('mysql');
var formidable = require('formidable');

if (process.env.PORT===undefined) {
  var credentials = require('./credentials.js');
} else {
  var credentials = {
    dbHost: process.env['dbHost'],
    dbUser: process.env['dbUser'],
    dbPassword: process.env['dbPassword'],
    database: process.env['database']
  };
}

//connect to database
var connection = mysql.createPool({
  connectionLimit: 4,
  host: credentials.dbHost,
  user: credentials.dbUser,
  password: credentials.dbPassword,
  database: credentials.database
});

database = {
  queryAllEmployees: function(req, res) {
    console.log('loading');
    connection.query('SELECT DISTINCT firstname, lastname FROM employees ORDER BY lastname ASC;', function(err, rows, fields) {
      if (err) {
        throw err;
      }
      console.log('sending back');
      res.status(200).send(rows);
    });
  },
  querySalaryHistory: function(req, res) {
    connection.query('SELECT DISTINCT firstname, lastname, salaries.employee_id, salary, start_of_salary, end_of_salary FROM salaries \
      JOIN employees on salaries.employee_id = employees.employee_id \
      WHERE employees.firstname = ? AND employees.lastname = ? \
      ORDER BY start_of_salary ASC;', [req.query.firstName, req.query.lastName],function(err, rows, fields) {
      res.status(200).send(rows);
    });
  },

};

module.exports = database;

