//server related dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 6474;
var cors=require('cors');
var bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));


app.post('/firstUpload', function(req, res){
  console.log('intercepted');
  console.log(req);
  res.status(200).send();
});

app.post('/secondUpload', function(req, res){
  console.log('intercepted');
  console.log(req);
  res.status(200);
});

app.post('*', function(req, res){
  console.log('intercepted');
  console.log(req);
  res.status(200);
});

app.get('*', function(req, res){
  console.log('intercepted');
  console.log(req);
  res.send('Hello world');
  res.status(200);
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
