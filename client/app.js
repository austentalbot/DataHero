
var upload = function(file, calls, path) {
  Papa.parse(file, {
    delimiter: ",",
    header: false,
    complete: function(results) {
      console.log(results.data);
      var data = results.data;
      //multiple posts because of size limit
      for (var i=0; i<calls; i++) {
        (function(i) {
          $.ajax('http://127.0.0.1:6474/'+path, {
            type: 'GET',
            data: {observations: data.slice(Math.round(i*(data.length/calls)), Math.round((i+1)*(data.length/calls)))}
          }).done(function(results) {
            console.log(results);
          });
        })(i);
      }
    }
  });
}


// document.getElementById('employeeFile').addEventListener('change', function(evt) {
//   upload(evt.target.files[0], 3, 'employee');
// });

// document.getElementById('salaryFile').addEventListener('change', function(evt) {
//   upload(evt.target.files[0], 18, 'salary');
// });

