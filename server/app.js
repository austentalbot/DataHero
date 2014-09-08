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
  //add employee data to db
  database.addEmployeeData(req, res);
});

app.post('/salary', function(req, res){
  console.log('intercepted salary');
  //parse incoming file
  // var form = new formidable.IncomingForm();
  // form.parse(req, function(err, fields, files) {
  //   if (err) {
  //     throw err;
  //   }
  //   // console.log(files);

  //   fs.readFile(files.upload.path, function (err, csv) {
  //     if (err) {
  //       throw err; 
  //     }
  //     var csvStr = csv.toString();
  //     // console.log(csvStr);
  //     babyparse.parse(csvStr, {
  //       complete: function(results, file) {
  //         // console.log(results.data);
  //         //drop and recreate employees table
  //         connection.query('DROP TABLE IF EXISTS salaries;', function(err) {
  //           if (err) {
  //             throw err;
  //           }
  //           connection.query('CREATE TABLE salaries ( \
  //             employee_id int, \
  //             salary int, \
  //             start_of_salary date, \
  //             end_of_salary date);', function(err) {
  //             if (err) {
  //               throw err;
  //             }
  //             connection.query('INSERT INTO salaries VALUES ?;', [results.data], function(err, rows, fields) {
  //               if (err) {
  //                 throw err;
  //               }
  //               // console.log(rows);
  //               console.log('added to db');
  //               res.status(200).sendFile(__dirname + '/views/dataView.html');;
  //             });
  //           });
  //         });
  //       }
  //     });
  //   });

  // });
  database.addSalaryData(req, res);
});

app.get('/employees', function(req, res) {
  //query names of all employees
  database.queryAllEmployees(req, res);
});

app.get('/salaryHistory', function(req, res) {
  //query employee's salary history
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
  //redirect to first page
  res.status(200).sendFile(__dirname + '/views/employeeUploadView.html');
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});

