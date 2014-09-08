//server related dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 6474;
var cors=require('cors');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var formidable = require('formidable');
var fs = require('fs');
var babyparse = require('babyparse');
var database = require('./database');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));


app.post('/employee', function(req, res){
  console.log('intercepted employee');
  
  //parse incoming file
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) {
      throw err;
    }
    // console.log(files);

    fs.readFile(files.upload.path, function (err, csv) {
      if (err) {
        throw err; 
      }
      var csvStr = csv.toString();
      // console.log(csvStr);
      babyparse.parse(csvStr, {
        complete: function(results, file) {
          // console.log(results.data);
          //drop and recreate employees table
          connection.query('DROP TABLE IF EXISTS employees;', function(err) {
            if (err) {
              throw err;
            }
            connection.query('CREATE TABLE employees ( \
              employee_id int, \
              birthday date, \
              firstname varchar(50), \
              lastname varchar(50), \
              sex char(1), \
              start_date date);', function(err) {
              if (err) {
                throw err;
              }
              connection.query('INSERT INTO employees VALUES ?;', [results.data], function(err, rows, fields) {
                if (err) {
                  throw err;
                }
                // console.log(rows);
                console.log('added to db');
                res.status(200).sendFile(__dirname + '/views/salaryUploadView.html');;
              });
            });
          });
        }
      });
    });

  });

});

app.post('/salary', function(req, res){
  console.log('intercepted salary');
  //parse incoming file

  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) {
      throw err;
    }
    // console.log(files);

    fs.readFile(files.upload.path, function (err, csv) {
      if (err) {
        throw err; 
      }
      var csvStr = csv.toString();
      // console.log(csvStr);
      babyparse.parse(csvStr, {
        complete: function(results, file) {
          // console.log(results.data);
          //drop and recreate employees table
          connection.query('DROP TABLE IF EXISTS salaries;', function(err) {
            if (err) {
              throw err;
            }
            connection.query('CREATE TABLE salaries ( \
              employee_id int, \
              salary int, \
              start_of_salary date, \
              end_of_salary date);', function(err) {
              if (err) {
                throw err;
              }
              connection.query('INSERT INTO salaries VALUES ?;', [results.data], function(err, rows, fields) {
                if (err) {
                  throw err;
                }
                // console.log(rows);
                console.log('added to db');
                res.status(200).sendFile(__dirname + '/views/dataView.html');;
              });
            });
          });
        }
      });
    });

  });

});

app.get('/employees', function(req, res) {
  //query names of all employees
  database.queryAllEmployees(req, res);
});

app.get('/salaryHistory', function(req, res) {
  // connection.query('SELECT DISTINCT firstname, lastname, salaries.employee_id, salary, start_of_salary, end_of_salary FROM salaries \
  //   JOIN employees on salaries.employee_id = employees.employee_id \
  //   WHERE employees.firstname = ? AND employees.lastname = ? \
  //   ORDER BY start_of_salary ASC;', [req.query.firstName, req.query.lastName],function(err, rows, fields) {
  //   res.status(200).send(rows);
  // });
  database.querySalaryHistory(req, res);
});

app.get('/style.css', function(req, res){
  console.log('intercepted style.css');
  res.status(200).sendFile(__dirname + '/css/style.css');
});

app.get('/client.js', function(req, res){
  console.log('intercepted client.js');
  res.status(200).sendFile(__dirname + '/js/client.js');
});

app.get('*', function(req, res){
  console.log('intercepted other');
  console.log(req.query);
  res.status(200).sendFile(__dirname + '/views/employeeUploadView.html');
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});

