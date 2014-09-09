var app = angular.module('dh', []);

app.factory('Query', function($http) {
  return {
    formatEndDate: function(date) {
      if (date[0]==='9') {
        return 'Present';
      } else {
        return date.slice(0, 7);
      }
    },    
    getSalary: function(firstName, lastName) {
      return $http({
        url: 'http://127.0.0.1:6474/salaryHistory',
        method: 'GET',
        params: {firstName: firstName, lastName: lastName}
      });
    },
    createChart: function(salaryHistory) {
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
        label+=this.formatEndDate(salary.end_of_salary);
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

    }    
  };
});

app.controller('load', function($http, $scope, $rootScope, Query) {
  $rootScope.selected = {};
  $rootScope.salaryHistory = [];
  $scope.contacts = [];
  $scope.formatEndDate = Query.formatEndDate;
  $scope.loadContacts = function() {
    $http({
      url: 'http://127.0.0.1:6474/employees',
      method: 'GET'
    }).success(function(data) {
      console.log(data);   
      $scope.contacts = data;
      //remove spinner
      document.getElementsByClassName('spinner')[0].remove();
    });
  };
});

//add event listener after users have been loaded
app.directive('repeatComplete', function($rootScope, Query) {
  return function(scope, element, attrs) {
    scope.selected = Query.selected;
    if (scope.$last){
      $('.user').on('click', function() {
        var firstname = this.getAttribute('data-firstname');
        var lastname = this.getAttribute('data-lastname');
        Query.getSalary(firstname, lastname)
        .success(function(data) {
          console.log(data);
          Query.createChart(data);
          $rootScope.selected = {firstname: firstname, lastname: lastname};
          $rootScope.salaryHistory = data;
        });
      });
    }
  };
});