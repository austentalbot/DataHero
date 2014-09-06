//server related dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 6474;

app.get('/*', function(req, res){
  res.send('Hello world');
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
