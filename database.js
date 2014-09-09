var babyparse = require('babyparse');
var mysql = require('mysql');
var formidable = require('formidable');
var fs = require('fs');

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

//database object for export
database = {
  //get all employee names from db
  queryAllEmployees: function(req, res) {
    console.log('loading');
    connection.query('SELECT DISTINCT firstname, lastname FROM employees ORDER BY lastname ASC;', function(err, rows, fields) {
      if (err) {
        console.log(err);
      }
      console.log('sending back');
      res.status(200).send(rows);
    });
  },
  //get salary history for specific employee from db
  querySalaryHistory: function(req, res) {
    connection.query('SELECT DISTINCT firstname, lastname, salaries.employee_id, salary, start_of_salary, end_of_salary FROM salaries \
      JOIN employees on salaries.employee_id = employees.employee_id \
      WHERE employees.firstname = ? AND employees.lastname = ? \
      ORDER BY start_of_salary ASC;', [req.query.firstName, req.query.lastName],function(err, rows, fields) {
      res.status(200).send(rows);
    });
  },
  //load employee data into db
  addEmployeeData: function(req, res) {
    //parse incoming file
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if (err) {
        console.log(err);
      }
      //break out and reload page if no file was uploaded
      if (files.upload.size===0) {
        res.status(200).sendFile(__dirname + '/views/employeeUploadView.html');
      } else {
        fs.readFile(files.upload.path, function (err, csv) {
          if (err) {
            console.log(err); 
          }
          var csvStr = csv.toString();
          //parse csv file into list to be batch inserted into sql
          babyparse.parse(csvStr, {
            complete: function(results, file) {
              //drop and recreate employees table
              connection.query('DROP TABLE IF EXISTS employees;', function(err) {
                if (err) {
                  console.log(err);
                }
                connection.query('CREATE TABLE employees ( \
                  employee_id int, \
                  birthday date, \
                  firstname varchar(50), \
                  lastname varchar(50), \
                  sex char(1), \
                  start_date date);', function(err) {
                  if (err) {
                    console.log(err);
                  }
                  //insert values into table
                  connection.query('INSERT INTO employees VALUES ?;', [results.data], function(err, rows, fields) {
                    if (err) {
                      console.log(err);
                    }
                    console.log('added to db');
                    res.status(200).sendFile(__dirname + '/views/salaryUploadView.html');
                  });
                });
              });
            }
          });
        });
      }
    });
  },
  //load salary data into sql
  addSalaryData: function(req, res) {
    //parse incoming file
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if (err) {
        console.log(err);
      }
      console.log('parsed salary upload');
      //break out and reload page if no file was uploaded
      if (files.upload.size===0) {
        res.status(200).sendFile(__dirname + '/views/salaryUploadView.html');
      } else {
        //read file that was uploaded
        fs.readFile(files.upload.path, function (err, csv) {
          if (err) {
            console.log(err);
          }
          console.log('read salary file');
          var csvStr = csv.toString();
          //parse csv file into list for batch insert into sql
          babyparse.parse(csvStr, {
            complete: function(results, file) {
              //drop and recreate employees table
              console.log('parsed salary file');
              connection.query('DROP TABLE IF EXISTS salaries;', function(err) {
                if (err) {
                  console.log(err);
                }
                console.log('dropped salary table');
                connection.query('CREATE TABLE salaries ( \
                  employee_id int, \
                  salary int, \
                  start_of_salary date, \
                  end_of_salary date);', function(err) {
                  if (err) {
                    console.log(err);
                  }
                  console.log('created salary table');
                  //insert values into db
                  connection.query('INSERT INTO salaries VALUES ?;', [results.data], function(err, rows, fields) {
                    if (err) {
                      console.log(err);
                    }
                    console.log('inserted values into salary');
                    // console.log(rows);
                    console.log('added to db');
                    res.status(200).sendFile(__dirname + '/views/dataView.html');
                  });
                });
              });
            }
          });
        });
      }
    });
  }

};

//export db object
module.exports = database;

