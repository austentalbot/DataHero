var handleFileSelect = function(evt) {
  var files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  var output = [];
  var f;
  for (var i = 0; i<files.length; i++) {
    f = files[i];
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
};

document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('files').addEventListener('change', function(evt) {
  // console.log(evt.target.files[0]);
  Papa.parse(evt.target.files[0], {
  delimiter: ",",
  header: false,
  complete: function(results) {
    console.log(results.data);
    var data = results.data;
    //multiple posts because of size limit
    for (var i=0; i<10; i++) {
      $.ajax('http://127.0.0.1:6474/firstUpload', {
        type: 'POST',
        data: data.slice(Math.floor(i*(data.length/10)), Math.floor((i+1)*(data.length/10)))
      }).done(function(results) {
        console.log(results);
      });
    }
  }

  });
});


