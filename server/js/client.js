var app = angular.module('dh', []);

app.controller('load', function($http, $scope, $rootScope) {

$rootScope.selected = {};
$rootScope.salaryHistory = [];
$scope.contacts = [];
$scope.loadContacts = function() {
  $http({
    url: 'http://127.0.0.1:6474/employees',
    method: 'GET'
  }).success(function(data) {
    console.log(data);     
    $scope.contacts = data;
  });
};

$scope.formatEndDate = function(date) {
  if (date[0]==='9') {
    return 'Present';
  } else {
    return date.slice(0, 7);
  }
};

$rootScope.getSalary = function(firstName, lastName) {
  return $http({
    url: 'http://127.0.0.1:6474/salaryHistory',
    method: 'GET',
    params: {firstName: firstName, lastName: lastName} 
  });
};

$rootScope.createChart = function(salaryHistory) {
  var ctx = document.getElementById('chart').getContext("2d");
  ctx.canvas.width = 700;
  ctx.canvas.height = 600;

  var labels = [];
  var values = [];
  for (var i=0; i<salaryHistory.length; i++) {
    var salary = salaryHistory[i];
    var label = '';
    label+=salary.start_of_salary.slice(0, 7);
    label+=' to ';
    label+=$scope.formatEndDate(salary.end_of_salary);
    labels.push(label);

    values.push(salary.salary);
  }

  var data = {
    labels: labels,
    datasets: [{
      label: 'Salary history',
      fillColor: "rgba(68,191,135,0.2)",
      strokeColor: "rgba(68,191,135,1)",
      highlightFill: "rgba(68,191,135,1)",
      highlightStroke: "rgba(220,220,220,1)",
      data: values
    }]
  };

    var options = {
      scaleFontFamily: "'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      scaleLabel: "$<%=Number(value).toLocaleString()%>",
      scaleBeginAtZero: true,
      tooltipEvents: []
    };

    var barChart = new Chart(ctx).Bar(data, options);

  };

});

//add event listener after users have been loaded
app.directive('repeatComplete', function($rootScope) {
  return function(scope, element, attrs) {
    if (scope.$last){
      $('.user').on('click', function() {
        var firstname = this.getAttribute('data-firstname');
        var lastname = this.getAttribute('data-lastname');
        $rootScope.getSalary(firstname, lastname)
        .success(function(data) {
          console.log(data);
          $rootScope.createChart(data);
          $rootScope.selected = {firstname: firstname, lastname: lastname};
          $rootScope.salaryHistory = data;
        });
      });
    }
  };
});