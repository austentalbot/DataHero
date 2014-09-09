//server related dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 6474;
var cors=require('cors');
var bodyParser = require('body-parser');
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
  //add salary data to db
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
  //serve up css file
  res.status(200).sendFile(__dirname + '/css/style.css');
});

app.get('/client.js', function(req, res){
  console.log('intercepted client.js');
  //serve up js file
  res.status(200).sendFile(__dirname + '/js/client.js');
});

app.get('/Chart.js', function(req, res){
  console.log('intercepted chart.js');
  //serve up Chart.js file
  res.status(200).sendFile(__dirname + '/js/Chart.js');
});

app.get('*', function(req, res){
  console.log('intercepted other');
  //redirect to first page
  res.status(200).sendFile(__dirname + '/views/employeeUploadView.html');
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});

