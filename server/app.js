//server related dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 6474;
var cors=require('cors');
var bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));


app.get('/employee', function(req, res){
  console.log('intercepted employee');
  console.log(req.query);
  res.status(200).send();
});

app.get('/salary', function(req, res){
  console.log('intercepted salary');
  console.log(req.query);
  res.status(200).send();
});

app.get('*', function(req, res){
  console.log('intercepted other');
  console.log(req.body);
  res.status(200).send();
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
