window.onload = function() {

  var upload = function(file, path) {
    $.ajax('http://127.0.0.1:6474/'+path, {
      type: 'POST',
      data: file,
      processData: false,
      contentType: file.type
    }).done(function(results) {
      console.log(results);
    });
  };

  var upload2 = function() {
    console.log('upload');
  };


  document.getElementById('employeeFile').addEventListener('change', function(evt) {
    console.log(evt.target.files[0]);
    upload(evt.target.files[0], 'employee');
  });

  // document.getElementById('salaryFile').addEventListener('change', function(evt) {
  //   upload(evt.target.files[0], 18, 'salary');
  // });

};
