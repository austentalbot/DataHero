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

app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

//load credentials
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

var connection = mysql.createPool({
  connectionLimit: 4,
  host: credentials.dbHost,
  user: credentials.dbUser,
  password: credentials.dbPassword,
  database: credentials.database
});


//create employee table
// employee_id / birthdate / firstname / lastname / sex / start_date
/*
connection.query('CREATE TABLE employees ( \
                employee_id int, \
                birthday date, \
                firstname varchar(50), \
                lastname varchar(50), \
                sex char(1), \
                start_date date);', function(err, rows, fields) {
  if (err) throw err;
  console.log(rows);
});
*/


connection.query('SELECT * from employees;', function(err, rows, fields) {
  if (err) throw err;
  console.log(rows);
});

app.post('/employee', function(req, res){
  console.log('intercepted employee');
  //parse incoming file


  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) {
      throw err;
    }
    console.log(files);

    fs.readFile(files.upload.path, function (err, csv) {
      if (err) {
        throw err; 
      }
      var csvStr = csv.toString();
      console.log(csvStr);
      babyparse.parse(csvStr, {
        complete: function(results, file) {
          console.log(results.data);
          //drop and recreate employees table
          connection.query('DROP TABLE employees?;', function() {
            connection.query('CREATE TABLE employees ( \
                            employee_id int, \
                            birthday date, \
                            firstname varchar(50), \
                            lastname varchar(50), \
                            sex char(1), \
                            start_date date);', function() {
              connection.query('INSERT INTO employees VALUES ?;', [results.data], function(err, rows, fields) {
                if (err) throw err;
                console.log(rows);
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
    console.log(files);
    res.status(200).sendFile(__dirname + '/views/dataView.html');;
  });

});

app.get('*', function(req, res){
  console.log('intercepted other');
  res.status(200).sendFile(__dirname + '/views/employeeUploadView.html');;
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
